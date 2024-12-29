class FilterDrawer {
    constructor(config = {}) {
        this.config = {
            drawerSelector: config.drawerSelector || '#filter-drawer',
            buttonSelector: config.buttonSelector || '#filter-button',
            applyButtonSelector: config.applyButtonSelector || '#apply-filters-btn',
            onApply: config.onApply || this.defaultApplyFilters
        };

        this.drawerElement = null;
        this.buttonElement = null;
        this.applyButtonElement = null;

        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        this.drawerElement = document.querySelector(this.config.drawerSelector);
        this.buttonElement = document.querySelector(this.config.buttonSelector);
        this.applyButtonElement = document.querySelector(this.config.applyButtonSelector);
    }

    setupEventListeners() {
        // Toggle drawer when button is clicked
        if (this.buttonElement) {
            this.buttonElement.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleDrawer();
            });
        }

        // Close drawer when clicking outside
        document.addEventListener('click', (event) => {
            if (this.isDrawerOpen() && 
                !this.isClickInsideDrawer(event) && 
                !this.isClickOnButton(event)) {
                this.closeDrawer();
            }
        });

        // Prevent drawer clicks from closing
        if (this.drawerElement) {
            this.drawerElement.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        }

        // Apply filters button
        if (this.applyButtonElement) {
            this.applyButtonElement.addEventListener('click', () => {
                const filters = this.collectFilters();
                this.config.onApply(filters);
                this.closeDrawer();
            });
        }
    }

    toggleDrawer() {
        this.drawerElement?.classList.toggle('hidden');
    }

    openDrawer() {
        this.drawerElement?.classList.remove('hidden');
    }

    closeDrawer() {
        this.drawerElement?.classList.add('hidden');
    }

    isDrawerOpen() {
        return this.drawerElement && !this.drawerElement.classList.contains('hidden');
    }

    isClickInsideDrawer(event) {
        return this.drawerElement?.contains(event.target);
    }

    isClickOnButton(event) {
        return this.buttonElement?.contains(event.target);
    }

    collectFilters() {
        const filters = {
            status: [],
            dateRange: {},
            rateRange: {}
        };

        // Collect status checkboxes
        const statusCheckboxes = this.drawerElement?.querySelectorAll('input[name="contract-status"]:checked');
        statusCheckboxes?.forEach(checkbox => {
            filters.status.push(checkbox.value);
        });

        // Collect date range
        const startDateInput = this.drawerElement?.querySelector('input[name="start-date"]');
        const endDateInput = this.drawerElement?.querySelector('input[name="end-date"]');
        if (startDateInput && endDateInput) {
            filters.dateRange = {
                start: startDateInput.value,
                end: endDateInput.value
            };
        }

        // Collect rate range
        const minRateInput = this.drawerElement?.querySelector('input[name="min-rate"]');
        const maxRateInput = this.drawerElement?.querySelector('input[name="max-rate"]');
        if (minRateInput && maxRateInput) {
            filters.rateRange = {
                min: minRateInput.value,
                max: maxRateInput.value
            };
        }

        return filters;
    }

    defaultApplyFilters(filters) {
        console.log('Default filter application:', filters);
        // Implement default filter logic or override with custom function
    }

    // Static method to create and initialize
    static create(config) {
        return new FilterDrawer(config);
    }
}

// Export as module
export default FilterDrawer; 