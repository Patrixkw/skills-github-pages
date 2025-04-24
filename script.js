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

            // Toggle active state for the clicked tag
            if (activeCapability === selectedCapability) {
                // Deactivate if clicking the same tag again
                tag.classList.remove('active');
                activeCapability = null;
                filterTimeline(null); // Show all
            } else {
                // Deactivate previously active tag
                capabilityTags.forEach(t => t.classList.remove('active'));
                // Activate the clicked tag
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
            filterTimeline(null); // Show all items
        });
    }

    // --- Timeline Filtering Function ---
    function filterTimeline(capability) {
        timelineItems.forEach(item => {
            // Always show non-project items (like company headers)
            if (!item.classList.contains('project-item')) {
                 item.classList.remove('filtered-out');
                 item.classList.remove('highlighted'); // Ensure no highlight
                 return; // Skip filtering for non-project items
            }

            // If no capability filter, show all project items
            if (!capability) {
                item.classList.remove('filtered-out');
                item.classList.remove('highlighted');
                return;
            }

            // Check if the item has the selected capability
            const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
            if (itemCapabilities.includes(capability)) {
                item.classList.remove('filtered-out');
                item.classList.add('highlighted'); // Highlight matching items
            } else {
                item.classList.add('filtered-out'); // Fade out non-matching items
                 item.classList.remove('highlighted');
            }
        });
    }

    // --- Optional: Add more interactivity here ---
    // e.g., Clicking a timeline item shows a modal with more details

}); 