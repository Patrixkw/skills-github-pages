document.addEventListener('DOMContentLoaded', () => {
    const capabilityTags = document.querySelectorAll('.cap-tag');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const resetButton = document.getElementById('reset-filter');
    const currentYearSpan = document.getElementById('current-year');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    let activeCapability = null;

    // --- Capability Filtering Logic ---
    capabilityTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedCapability = tag.dataset.capability;

            if (activeCapability === selectedCapability) {
                tag.classList.remove('active');
                activeCapability = null;
                filterTimeline(null); 
            } else {
                capabilityTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                activeCapability = selectedCapability;
                filterTimeline(activeCapability);
            }
        });
    });

    // --- Reset Filter Logic ---
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            capabilityTags.forEach(tag => tag.classList.remove('active'));
            activeCapability = null;
            filterTimeline(null); 
            // Scroll back to the top of the experience section after reset
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Timeline Filtering Function ---
    function filterTimeline(capability) {
        let firstMatchFound = false; // Flag to track if the first matching project has been found
        let firstMatchingElement = null;

        timelineItems.forEach(item => {
            // Always show non-project items
            if (!item.classList.contains('project-item')) {
                 item.classList.remove('filtered-out', 'highlighted');
                 return; 
            }

            const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
            const isMatch = !capability || itemCapabilities.includes(capability);

            if (isMatch) {
                item.classList.remove('filtered-out');
                item.classList.add('highlighted'); 
                // Capture the first matching project item
                if (!firstMatchFound) {
                    firstMatchingElement = item;
                    firstMatchFound = true;
                }
            } else {
                item.classList.add('filtered-out'); 
                item.classList.remove('highlighted');
            }
        });

        // Scroll the first matching project item into view if a filter is active
        if (capability && firstMatchingElement) {
             // Use timeout to ensure rendering changes are applied before scrolling
             setTimeout(() => {
                 firstMatchingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }, 100); // Small delay might be needed
        }
    }

    // --- Optional: Add more interactivity here ---
    // e.g., Clicking a timeline item shows a modal with more details

}); 