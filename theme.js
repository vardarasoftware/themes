// Wrap the entire script in a self-invoking function to create a global scope
(function() {
    // Utility Functions
    function toggleAccordion(id) {
        const content = document.getElementById(`content-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        const isHidden = content.classList.contains("hidden");

        content.classList.toggle("hidden", !isHidden);
        icon.classList.toggle("rotate-180", isHidden);

        // Update aria-expanded
        const button = document.getElementById(`button-${id}`);
        button.setAttribute("aria-expanded", isHidden ? "true" : "false");
    }

    function toggleMenu() {
        const menu = document.getElementById('mobile-menu');
        menu.classList.toggle('hidden');
    }

    function togglePopup(id) {
        const popup = document.getElementById(`popup-${id}`);
        popup.classList.toggle('hidden');
    }

    function toggleJobDrawer(id) {
        const drawer = document.getElementById(`job-drawer-${id}`);
        drawer.classList.toggle('translate-x-full');
        drawer.classList.toggle('translate-x-0');
        
        // Prevent body scrolling when drawer is open
        document.body.classList.toggle('overflow-hidden');

        // Add event listener for Escape key
        if (!drawer.classList.contains('translate-x-full')) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    }

    function closeJobDrawer(id) {
        const drawer = document.getElementById(`job-drawer-${id}`);
        drawer.classList.add('translate-x-full');
        drawer.classList.remove('translate-x-0');
        
        // Re-enable body scrolling
        document.body.classList.remove('overflow-hidden');

        // Remove Escape key event listener
        document.removeEventListener('keydown', handleEscapeKey);
    }

    // Separate function to handle Escape key
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            // Find the open drawer for both job and talent pages
            const openJobDrawer = document.querySelector('[id^="job-drawer-"]:not(.translate-x-full)');
            const openTalentDrawer = document.querySelector('[id^="talent-drawer-"]:not(.translate-x-full)');
            
            if (openJobDrawer) {
                const drawerId = openJobDrawer.id.split('-')[2];
                closeJobDrawer(drawerId);
            }
            
            if (openTalentDrawer) {
                const drawerId = openTalentDrawer.id.split('-')[2];
                closeDrawer(drawerId);
            }
        }
    }

    // Keyboard navigation for job cards
    let currentJobIndex = -1;
    let jobCards = [];

    function initializeJobCardNavigation() {
        // Select job cards and convert to array
        jobCards = Array.from(document.querySelectorAll('[id^="job-card-"]'));

        // If no job cards found, return
        if (jobCards.length === 0) return;

        // Add unique IDs and attributes to job cards
        jobCards.forEach((card, index) => {
            card.id = `job-card-${index + 1}`;
            card.setAttribute('tabindex', '-1');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', `Job: ${card.querySelector('h2').textContent}`);
        });

        // Automatically focus the first job card
        currentJobIndex = 0;
        focusJobCard(currentJobIndex);
    }

    function handleJobCardKeyNavigation(event) {
        // Ensure we're not in an input field or other interactive element
        if (event.target.tagName === 'INPUT') return;

        // Ensure job cards are initialized
        if (jobCards.length === 0) {
            initializeJobCardNavigation();
        }

        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                currentJobIndex = (currentJobIndex + 1) % jobCards.length;
                focusJobCard(currentJobIndex);
                break;
            case 'ArrowUp':
                event.preventDefault();
                currentJobIndex = (currentJobIndex - 1 + jobCards.length) % jobCards.length;
                focusJobCard(currentJobIndex);
                break;
            case 'Enter':
                if (currentJobIndex !== -1) {
                    const jobCard = jobCards[currentJobIndex];
                    const showMoreButton = jobCard.querySelector('[onclick^="toggleJobDrawer"]');
                    if (showMoreButton) {
                        showMoreButton.click();
                    }
                }
                break;
        }
    }

    function focusJobCard(index) {
        // Remove previous focus from all cards
        jobCards.forEach(card => {
            card.classList.remove('ring-2', 'ring-blue-500');
            card.setAttribute('tabindex', '-1');
        });

        // Add focus to current card
        const currentCard = jobCards[index];
        currentCard.classList.add('ring-2', 'ring-blue-500');
        currentCard.setAttribute('tabindex', '0');
        currentCard.focus();
    }

    // Event Listeners
    document.addEventListener('click', (event) => {
        const notifications = document.getElementById('popup-notifications');
        const accountInfo = document.getElementById('popup-account-info');

        if (!event.target.closest('#notifications-icon')) {
            notifications.classList.add('hidden');
        }

        if (!event.target.closest('#account-info-icon')) {
            accountInfo.classList.add('hidden');
        }

        // Close job drawers when clicking outside
        const jobDrawers = document.querySelectorAll('[id^="job-drawer-"]');
        
        jobDrawers.forEach((drawer) => {
            // Check if the drawer is open (not translated)
            if (!drawer.classList.contains('translate-x-full')) {
                // Check if the click is outside the drawer and not on the "Show More" button
                if (!drawer.contains(event.target) && 
                    !event.target.closest(`[onclick="toggleJobDrawer(${drawer.id.split('-')[2]})"]`)) {
                    // Close the drawer
                    const drawerId = drawer.id.split('-')[2];
                    closeJobDrawer(drawerId);
                }
            }
        });
    });

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', handleJobCardKeyNavigation);

    // Initialize job card navigation when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initializeJobCardNavigation);

    // Modify the card navigation functions to be more generic
    function initializeCardNavigation(cardSelector = '[id^="card-"]', drawerSelector = '[id^="drawer-"]') {
        // Select cards and convert to array
        const cards = Array.from(document.querySelectorAll(cardSelector));

        // If no cards found, return
        if (cards.length === 0) return;

        // Add unique IDs and attributes to cards if not already present
        cards.forEach((card, index) => {
            // Only add ID if not already present
            if (!card.id) {
                card.id = `card-${index + 1}`;
            }
            
            card.setAttribute('tabindex', '-1');
            card.setAttribute('role', 'button');
            
            // Try to find a title or heading for aria-label
            const titleElement = card.querySelector('h2') || card.querySelector('h1');
            if (titleElement) {
                card.setAttribute('aria-label', `Card: ${titleElement.textContent}`);
            }
        });

        // Automatically focus the first card
        let currentCardIndex = 0;
        focusCard(cards, currentCardIndex);

        // Return cards for potential further manipulation
        return cards;
    }

    function focusCard(cards, index) {
        // Ensure index is valid
        if (index < 0 || index >= cards.length) {
            console.warn(`Invalid card index: ${index}`);
            return;
        }

        // Remove previous focus from all cards
        cards.forEach(card => {
            card.classList.remove('ring-2', 'ring-blue-500');
            card.setAttribute('tabindex', '-1');
        });

        // Add focus to current card
        const currentCard = cards[index];
        if (currentCard) {
            currentCard.classList.add('ring-2', 'ring-blue-500');
            currentCard.setAttribute('tabindex', '0');
            currentCard.focus();
        } else {
            console.warn(`Card at index ${index} is undefined`);
        }
    }

    function handleCardKeyNavigation(event, cardSelector = '[id^="card-"]', drawerSelector = '[id^="drawer-"]') {
        // Ensure we're not in an input field or other interactive element
        if (event.target.tagName === 'INPUT') return;

        // Select cards
        const cards = Array.from(document.querySelectorAll(cardSelector));

        // If no cards found, initialize
        if (cards.length === 0) {
            initializeCardNavigation(cardSelector, drawerSelector);
            return;
        }

        // Find current focused card
        const currentCardIndex = cards.findIndex(card => card.classList.contains('ring-2'));

        switch(event.key) {
            case 'ArrowDown':
                event.preventDefault();
                const nextIndex = (currentCardIndex + 1) % cards.length;
                focusCard(cards, nextIndex);
                break;
            case 'ArrowUp':
                event.preventDefault();
                const prevIndex = (currentCardIndex - 1 + cards.length) % cards.length;
                focusCard(cards, prevIndex);
                break;
            case 'Enter':
                if (currentCardIndex !== -1) {
                    const currentCard = cards[currentCardIndex];
                    
                    // Try different selector patterns for show more button
                    const showMoreButton = 
                        currentCard.querySelector('[onclick^="toggleDrawer"]') || 
                        currentCard.querySelector('[onclick^="toggleJobDrawer"]');
                    
                    if (showMoreButton) {
                        showMoreButton.click();
                    } else {
                        console.warn('No show more button found for current card');
                    }
                }
                break;
        }
    }

    // Explicitly attach functions to the global window object
    window.toggleDrawer = function(id, drawerSelector = '[id^="drawer-"]') {
        console.log(`Attempting to toggle drawer ${id}`);
        
        // Try different drawer ID patterns based on the current page
        const jobDrawer = document.getElementById(`job-drawer-${id}`);
        const talentDrawer = document.getElementById(`talent-drawer-${id}`);
        
        const drawer = jobDrawer || talentDrawer;
        
        if (!drawer) {
            console.error(`Drawer with ID job-drawer-${id} or talent-drawer-${id} not found`);
            return;
        }

        drawer.classList.toggle('translate-x-full');
        drawer.classList.toggle('translate-x-0');
        
        // Prevent body scrolling when drawer is open
        document.body.classList.toggle('overflow-hidden');

        // Add event listener for Escape key
        if (!drawer.classList.contains('translate-x-full')) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }
    };

    window.closeDrawer = function(id, drawerSelector = '[id^="drawer-"]') {
        // Try different drawer ID patterns based on the current page
        const jobDrawer = document.getElementById(`job-drawer-${id}`);
        const talentDrawer = document.getElementById(`talent-drawer-${id}`);
        
        const drawer = jobDrawer || talentDrawer;
        
        if (!drawer) {
            console.error(`Drawer with ID job-drawer-${id} or talent-drawer-${id} not found`);
            return;
        }

        drawer.classList.add('translate-x-full');
        drawer.classList.remove('translate-x-0');
        
        // Re-enable body scrolling
        document.body.classList.remove('overflow-hidden');

        // Remove Escape key event listener
        document.removeEventListener('keydown', handleEscapeKey);
    };

    // Maintain backward compatibility for job-specific drawer functions
    window.toggleJobDrawer = function(id) {
        // Use the generic toggleDrawer function with job-specific selector
        toggleDrawer(id, '[id^="job-drawer-"]');
    };

    window.closeJobDrawer = function(id) {
        // Use the generic closeDrawer function with job-specific selector
        closeDrawer(id, '[id^="job-drawer-"]');
    };

    // Modify existing event listeners to support multiple page types
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Loaded');
        
        // Check for job cards
        const jobCards = document.querySelectorAll('[id^="job-card-"]');
        if (jobCards.length > 0) {
            console.log('Initializing Job Card Navigation');
            initializeCardNavigation('[id^="job-card-"]', '[id^="job-drawer-"]');
        }
        
        // Check for talent cards
        const talentCards = document.querySelectorAll('[id^="talent-card-"]');
        if (talentCards.length > 0) {
            console.log('Initializing Talent Card Navigation');
            initializeCardNavigation('[id^="talent-card-"]', '[id^="talent-drawer-"]');
        }
    });

    // Add event listener for keyboard navigation
    document.addEventListener('keydown', (event) => {
        const jobCards = document.querySelectorAll('[id^="job-card-"]');
        const talentCards = document.querySelectorAll('[id^="talent-card-"]');

        if (jobCards.length > 0) {
            handleCardKeyNavigation(event, '[id^="job-card-"]', '[id^="job-drawer-"]');
        } else if (talentCards.length > 0) {
            handleCardKeyNavigation(event, '[id^="talent-card-"]', '[id^="talent-drawer-"]');
        }
    });
})();
