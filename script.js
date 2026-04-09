/**
 * Task Manager Application
 * 
 * A simple task management app with three states: active, done, and deleted.
 * Uses localStorage for persistence and event delegation for performance.
 * 
 * @module TaskManager
 */

(function() {
    'use strict';

    // ==========================================================================
    // State Management
    // ==========================================================================
    
    /** @type {Object.<string, string[]>} */
    const state = {
        active: [],
        done: [],
        deleted: []
    };

    /** @type {Object.<string, boolean>} Current view state */
    const viewState = {
        isActive: true,
        isDone: false,
        isDeleted: false
    };

    /** @type {number} Unique ID counter for tasks */
    let taskIdCounter = 1;

    // ==========================================================================
    // DOM Elements Cache
    // ==========================================================================
    
    const elements = {};

    /**
     * Initialize DOM element references
     */
    function cacheElements() {
        elements.addBtn = document.getElementById('add');
        elements.activeBtn = document.getElementById('active-page');
        elements.doneBtn = document.getElementById('done-page');
        elements.deletedBtn = document.getElementById('deleted-page');
        elements.list = document.getElementById('list');
    }

    // ==========================================================================
    // LocalStorage Helpers
    // ==========================================================================
    
    const STORAGE_KEYS = {
        ACTIVE: 'active',
        DONE: 'done',
        DELETED: 'deleted'
    };

    /**
     * Safely parse JSON from localStorage
     * @param {string} key - Storage key
     * @returns {any} Parsed data or null
     */
    function getFromStorage(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const parsed = JSON.parse(item);
            // Handle double-serialized data (legacy bug fix)
            if (typeof parsed === 'string') {
                return JSON.parse(parsed);
            }
            return parsed;
        } catch (error) {
            console.error(`Error reading from localStorage (${key}):`, error);
            return null;
        }
    }

    /**
     * Safely stringify and save to localStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    function saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving to localStorage (${key}):`, error);
        }
    }

    /**
     * Load all task arrays from localStorage
     */
    function loadTasks() {
        state.active = getFromStorage(STORAGE_KEYS.ACTIVE) || [];
        state.done = getFromStorage(STORAGE_KEYS.DONE) || [];
        state.deleted = getFromStorage(STORAGE_KEYS.DELETED) || [];
        
        // Update ID counter based on loaded tasks
        const totalTasks = state.active.length + state.done.length + state.deleted.length;
        taskIdCounter = totalTasks + 1;
    }

    /**
     * Save current state to localStorage
     */
    function persistState() {
        saveToStorage(STORAGE_KEYS.ACTIVE, state.active);
        saveToStorage(STORAGE_KEYS.DONE, state.done);
        saveToStorage(STORAGE_KEYS.DELETED, state.deleted);
    }

    // ==========================================================================
    // UI Rendering
    // ==========================================================================
    
    /**
     * Clear the task list
     */
    function clearList() {
        elements.list.textContent = '';
    }

    /**
     * Render tasks from a specific array
     * @param {string[]} tasks - Array of task strings
     */
    function renderTasks(tasks) {
        clearList();
        
        if (!tasks || tasks.length === 0) return;

        // Use DocumentFragment for batch DOM updates (performance)
        const fragment = document.createDocumentFragment();
        
        tasks.forEach(taskText => {
            const listItem = document.createElement('li');
            listItem.textContent = taskText; // XSS protection: textContent instead of innerHTML
            listItem.className = 'list__item';
            fragment.appendChild(listItem);
        });
        
        elements.list.appendChild(fragment);
    }

    /**
     * Update button focus based on current view
     */
    function updateButtonFocus() {
        if (viewState.isActive) {
            elements.activeBtn.focus();
        } else if (viewState.isDone) {
            elements.doneBtn.focus();
        } else {
            elements.deletedBtn.focus();
        }
    }

    /**
     * Update aria-pressed attributes for accessibility
     */
    function updateButtonStates() {
        elements.activeBtn.setAttribute('aria-pressed', viewState.isActive);
        elements.doneBtn.setAttribute('aria-pressed', viewState.isDone);
        elements.deletedBtn.setAttribute('aria-pressed', viewState.isDeleted);
    }

    // ==========================================================================
    // Event Handlers
    // ==========================================================================
    
    /**
     * Handle adding a new task
     */
    function handleAddTask() {
        const taskText = prompt('Input text...');
        
        // Guard clause: empty input or user cancelled
        if (!taskText || taskText.trim() === '') return;
        
        state.active.push(taskText.trim());
        persistState();
        
        // Only re-render if we're in active view
        if (viewState.isActive) {
            renderTasks(state.active);
        }
    }

    /**
     * Handle task list clicks (event delegation)
     * @param {Event} event - Click event
     */
    function handleListClick(event) {
        const target = event.target;
        
        // Ensure we're clicking on an LI element
        if (target.tagName !== 'LI') return;
        
        const taskText = target.textContent;
        
        if (viewState.isActive) {
            // Move from Active → Done
            state.active = state.active.filter(item => item !== taskText);
            state.done.push(taskText);
        } else if (viewState.isDone) {
            // Move from Done → Active
            state.done = state.done.filter(item => item !== taskText);
            state.active.push(taskText);
        } else if (viewState.isDeleted) {
            // Move from Deleted → Active
            state.deleted = state.deleted.filter(item => item !== taskText);
            state.active.push(taskText);
        }
        
        persistState();
        renderCurrentView();
    }

    /**
     * Handle context menu (right-click) on tasks
     * @param {Event} event - Context menu event
     */
    function handleContextMenu(event) {
        const target = event.target;
        
        // Only handle right-click in active view
        if (!viewState.isActive || target.tagName !== 'LI') return;
        
        event.preventDefault(); // Prevent default context menu
        
        const taskText = target.textContent;
        
        // Move from Active → Deleted
        state.active = state.active.filter(item => item !== taskText);
        state.deleted.push(taskText);
        
        persistState();
        renderCurrentView();
    }

    /**
     * Switch to Active view
     */
    function handleActiveView() {
        viewState.isActive = true;
        viewState.isDone = false;
        viewState.isDeleted = false;
        
        updateButtonStates();
        renderTasks(state.active);
    }

    /**
     * Switch to Done view
     */
    function handleDoneView() {
        viewState.isActive = false;
        viewState.isDone = true;
        viewState.isDeleted = false;
        
        updateButtonStates();
        renderTasks(state.done);
    }

    /**
     * Switch to Deleted view
     */
    function handleDeletedView() {
        viewState.isActive = false;
        viewState.isDone = false;
        viewState.isDeleted = true;
        
        updateButtonStates();
        renderTasks(state.deleted);
    }

    /**
     * Render tasks based on current view state
     */
    function renderCurrentView() {
        if (viewState.isActive) {
            renderTasks(state.active);
        } else if (viewState.isDone) {
            renderTasks(state.done);
        } else {
            renderTasks(state.deleted);
        }
    }

    // ==========================================================================
    // Event Binding
    // ==========================================================================
    
    /**
     * Bind all event listeners
     */
    function bindEvents() {
        // Add button click
        elements.addBtn.addEventListener('click', handleAddTask);
        
        // View switch buttons
        elements.activeBtn.addEventListener('click', handleActiveView);
        elements.doneBtn.addEventListener('click', handleDoneView);
        elements.deletedBtn.addEventListener('click', handleDeletedView);
        
        // List interactions (using event delegation)
        elements.list.addEventListener('click', handleListClick);
        elements.list.addEventListener('contextmenu', handleContextMenu);
    }

    // ==========================================================================
    // Initialization
    // ==========================================================================
    
    /**
     * Initialize the application
     */
    function init() {
        cacheElements();
        loadTasks();
        bindEvents();
        renderTasks(state.active);
        updateButtonFocus();
        updateButtonStates();
    }

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();