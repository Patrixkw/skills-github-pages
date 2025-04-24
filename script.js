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
    function resetAllStates(options = { resetCapability: true, resetProject: true, reorder: true }) {
        if (options.resetCapability) {
            capabilityTags.forEach(tag => tag.classList.remove('active', 'highlighted-by-project'));
            activeCapability = null;
        }
        if (options.resetProject) {
            projectItems.forEach(item => item.classList.remove('selected-project'));
            selectedProject = null;
        }
        if (options.reorder) {
            filterTimeline(activeCapability); // Re-filter based on potentially remaining activeCapability
        }
    }

    // --- Capability Tag Click Logic ---
    capabilityTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const clickedCapability = tag.dataset.capability;

            if (tag.classList.contains('active')) {
                // Clicked the already active tag: reset everything
                resetAllStates();
            } else {
                // Clicked a new or inactive tag: reset previous, set new active
                resetAllStates({ resetCapability: true, resetProject: true, reorder: false }); // Don't reorder yet
                tag.classList.add('active');
                activeCapability = clickedCapability;
                filterTimeline(activeCapability); // Now filter and reorder
            }
        });
    });

    // --- Project Item Click Logic ---
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            if (item.classList.contains('selected-project')) {
                // Clicked the already selected project: reset everything
                resetAllStates();
            } else {
                // Clicked a new project: reset previous, set new selected
                resetAllStates({ resetCapability: true, resetProject: true, reorder: false }); // Keep current timeline order

                item.classList.add('selected-project');
                selectedProject = item;

                const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
                capabilityTags.forEach(tag => {
                    if (itemCapabilities.includes(tag.dataset.capability)) {
                        tag.classList.add('highlighted-by-project');
                    }
                });
            }
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
        const fragment = document.createDocumentFragment();
        const matchedItems = [];
        const nonMatchedItems = []; // Keep track of non-matched for potential ordering

        allTimelineItems.forEach(item => {
            // Reset classes before evaluation
            item.classList.remove('filtered-out', 'highlighted');

            if (!item.classList.contains('project-item')) {
                // Always keep work items visible
                matchedItems.push(item);
                return;
            }

            const itemCapabilities = item.dataset.capabilities ? item.dataset.capabilities.split(' ') : [];
            const isMatch = !capability || itemCapabilities.includes(capability);

            if (isMatch) {
                item.classList.add('highlighted');
                matchedItems.push(item);
            } else {
                item.classList.add('filtered-out');
                nonMatchedItems.push(item); // Add to non-matched list
            }
        });

        // Re-append in order: Matched first, then non-matched
        // Detach all items first to avoid issues with re-appending existing children
        while (timelineContainer.firstChild) {
            timelineContainer.removeChild(timelineContainer.firstChild);
        }

        matchedItems.forEach(item => fragment.appendChild(item));
        nonMatchedItems.forEach(item => fragment.appendChild(item)); // Append filtered ones at the end

        timelineContainer.appendChild(fragment);
    }

    // Initial state setup (show all)
    filterTimeline(null);

    // --- Optional: Add more interactivity here ---
    // e.g., Clicking a timeline item shows a modal with more details

}); 