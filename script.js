document.addEventListener('DOMContentLoaded', () => {
    const capabilityTags = document.querySelectorAll('.cap-tag');
    const timelineContainer = document.querySelector('.timeline'); // Get the timeline container
    const allTimelineItems = Array.from(timelineContainer.querySelectorAll('.timeline-item')); // Get all items once
    const projectItems = timelineContainer.querySelectorAll('.project-item');
    const resetButton = document.getElementById('reset-filter');
    const currentYearSpan = document.getElementById('current-year');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    let activeCapability = null;
    let selectedProject = null;

    // --- Reset All Highlights and Filters ---
    function resetAllStates() {
        // Reset capability tags
        capabilityTags.forEach(tag => tag.classList.remove('active', 'highlighted-by-project'));
        activeCapability = null;

        // Reset project selections
        projectItems.forEach(item => item.classList.remove('selected-project'));
        selectedProject = null;

        // Reset timeline visibility and order
        filterTimeline(null);
    }

    // --- Capability Tag Click Logic ---
    capabilityTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const selectedCapability = tag.dataset.capability;
            resetAllStates(); // Reset everything before applying new filter

            tag.classList.add('active');
            activeCapability = selectedCapability;
            filterTimeline(activeCapability);
        });
    });

    // --- Project Item Click Logic ---
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            resetAllStates(); // Reset states first

            // Highlight clicked project
            item.classList.add('selected-project');
            selectedProject = item;

            // Highlight associated capability tags
            const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
            capabilityTags.forEach(tag => {
                if (itemCapabilities.includes(tag.dataset.capability)) {
                    tag.classList.add('highlighted-by-project');
                }
            });
        });
    });

    // --- Reset Button Logic ---
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            resetAllStates();
            // Optional: Scroll back to top after reset if needed
            // document.getElementById('experience').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // --- Timeline Filtering and Reordering Function ---
    function filterTimeline(capability) {
        const fragment = document.createDocumentFragment(); // Use fragment for efficiency
        const matchedItems = [];
        const nonMatchedItems = [];

        // Separate items based on filter (or lack thereof)
        allTimelineItems.forEach(item => {
            if (!item.classList.contains('project-item')) {
                // Always include non-project items (like company headers) at their original relative position
                // For simplicity, we'll append them first if no filter, or handle complex ordering if needed.
                // Current simple approach: just show them always.
                item.classList.remove('filtered-out', 'highlighted');
                matchedItems.push(item); // Add non-project items to the top when filtering for simplicity
                return;
            }

            const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
            const isMatch = !capability || itemCapabilities.includes(capability);

            item.classList.remove('filtered-out', 'highlighted'); // Reset classes first

            if (isMatch) {
                item.classList.add('highlighted');
                matchedItems.push(item);
            } else {
                item.classList.add('filtered-out');
                nonMatchedItems.push(item);
            }
        });

        // Clear the timeline container
        // timelineContainer.innerHTML = ''; // This can be disruptive, appending is better

        // Append matched items first, then non-matched items
        matchedItems.forEach(item => fragment.appendChild(item));
        nonMatchedItems.forEach(item => fragment.appendChild(item));

        // Append the reordered items back to the container
        timelineContainer.appendChild(fragment);
    }

    // Initial state setup (show all)
    filterTimeline(null);

    // --- Optional: Add more interactivity here ---
    // e.g., Clicking a timeline item shows a modal with more details

}); 