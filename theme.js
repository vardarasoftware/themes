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
        // Find the open drawer
        const openDrawer = document.querySelector('[id^="job-drawer-"]');
        
        if (openDrawer) {
            // Extract the drawer ID
            const drawerId = openDrawer.id.split('-')[2];
            closeJobDrawer(drawerId);
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
