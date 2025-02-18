document.addEventListener('DOMContentLoaded', () =>
{
    // Initialize week cards
    initializeWeekCards();
    // Initialize year and month selection
    initializeYearMonthSelection();
    updateStatVisibility();
});

function initializeWeekCards()
{
    const weekCards = document.querySelectorAll('.week-card');

    weekCards.forEach(card =>
    {
        const header = card.querySelector('.week-header');
        const expandIcon = header.querySelector('.expand-icon');

        // Handle expand icon click
        expandIcon.addEventListener('click', (e) =>
        {
            e.stopPropagation(); // Prevent header click event

            // If the card is already expanded, close it
            if (card.classList.contains('expanded'))
            {
                card.classList.remove('expanded');
                expandIcon.style.transform = 'rotate(0deg)';
            } else
            {
                // Close any other expanded cards
                weekCards.forEach(otherCard =>
                {
                    if (otherCard !== card && otherCard.classList.contains('expanded'))
                    {
                        otherCard.classList.remove('expanded');
                        otherCard.querySelector('.expand-icon').style.transform = 'rotate(0deg)';
                    }
                });

                // Expand this card
                card.classList.add('expanded');
                expandIcon.style.transform = 'rotate(90deg)';

                // Populate days if needed
                if (card.querySelector('.week-content').children.length === 0)
                {
                    populateDays(card);
                }
            }
        });

        // Handle header click for selection
        header.addEventListener('click', (e) =>
        {
            if (e.target !== expandIcon)
            {
                // Remove active class from all week cards
                weekCards.forEach(c => c.classList.remove('active'));

                // Add active class to clicked card
                card.classList.add('active');

                // Update summary stats
                updateWeekCard(card);
            }
        });
    });

    // Set initial active state
    weekCards[0].querySelector('.week-header').click();
}

function initializeYearMonthSelection()
{
    // Year selection
    const yearCards = document.querySelectorAll('.year-card');
    const yearSummary = document.querySelector('.year-summary');

    yearCards.forEach(card =>
    {
        card.addEventListener('click', () =>
        {
            yearCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            yearSummary.classList.add('active');
            updateYearSummary(card.dataset.year);
        });
    });

    // Month selection
    const monthCards = document.querySelectorAll('.month-card');
    const monthSummary = document.querySelector('.month-summary');

    // Initialize each month with random stats
    monthCards.forEach(card => {
        // Example data - some months with all zeros, some with counts
        const monthData = {
            1: { absent: 2, punchMissing: 3, late: 5 },     // January - with counts
            2: { absent: 0, punchMissing: 0, late: 0 },     // February - all zeros
            3: { absent: 1, punchMissing: 0, late: 2 },     // March - mixed
            4: { absent: 0, punchMissing: 0, late: 0 },     // April - all zeros
            5: { absent: 3, punchMissing: 1, late: 0 },     // May - mixed
            // ... rest can be random
        };

        const monthNumber = parseInt(card.dataset.month);
        let stats;
        
        if (monthData[monthNumber]) {
            stats = monthData[monthNumber];
        } else {
            // Random stats for other months
            stats = {
                absent: Math.floor(Math.random() * 5),
                punchMissing: Math.floor(Math.random() * 7),
                late: Math.floor(Math.random() * 10)
            };
        }
        
        updateMonthCard(card, stats);

        card.addEventListener('click', () =>
        {
            monthCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Initialize each week with random stats
    const weekCards = document.querySelectorAll('.week-card');
    weekCards.forEach(card => {
        // Example data - some weeks with all zeros, some with counts
        const weekData = {
            1: { absent: 1, punchMissing: 2, late: 3 },     // Week 1 - with counts
            2: { absent: 0, punchMissing: 0, late: 0 },     // Week 2 - all zeros
            3: { absent: 0, punchMissing: 1, late: 0 },     // Week 3 - mixed
        };

        const weekNumber = parseInt(card.dataset.week);
        const stats = weekData[weekNumber];
        
        // Update the week's inline summary with initial stats
        Object.entries(stats).forEach(([key, value]) => {
            const statElement = card.querySelector(`.inline-summary [data-type="${key}"] .stat-value`);
            if (statElement) {
                statElement.textContent = value.toString();
                const statItem = statElement.closest('.stat-item');
                if (value === 0) {
                    statItem.classList.add('hidden');
                } else {
                    statItem.classList.remove('hidden');
                }
            }
        });

        // Handle the tick mark
        const allGoodMark = card.querySelector('.inline-summary .all-good');
        const allZero = Object.values(stats).every(value => value === 0);
        if (allGoodMark) {
            if (allZero) {
                allGoodMark.classList.remove('hidden');
            } else {
                allGoodMark.classList.add('hidden');
            }
        }
    });

    // Set initial active states
    yearCards[0].click();
    monthCards[0].click();
}

function populateDays(weekCard)
{
    const weekContent = weekCard.querySelector('.week-content');
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    days.forEach(day =>
    {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-item';
        dayElement.textContent = day;
        weekContent.appendChild(dayElement);
    });
}

function calculateTotals()
{
    // Calculate week totals
    const weeks = document.querySelectorAll('.week-card');
    weeks.forEach(week =>
    {
        // In a real application, these would come from your data source
        const weekStats = {
            absent: parseInt(week.querySelector('[data-type="absent"] .stat-value').textContent),
            punchMissing: parseInt(week.querySelector('[data-type="punch-missing"] .stat-value').textContent),
            late: parseInt(week.querySelector('[data-type="late"] .stat-value').textContent)
        };
        updateParentTotals(week, weekStats);
    });
}

function updateParentTotals(element, stats)
{
    // Find parent month
    const monthCard = element.closest('.months-row')?.querySelector('.month-card');
    if (monthCard)
    {
        // Update month totals
        updateStats(monthCard, stats);
    }

    // Find parent year
    const yearCard = element.closest('.calendar-container')?.querySelector('.year-card');
    if (yearCard)
    {
        // Update year totals
        updateStats(yearCard, stats);
    }
}

function updateStats(card, stats)
{
    Object.entries(stats).forEach(([key, value]) =>
    {
        const statElement = card.querySelector(`[data-type="${ key }"] .stat-value`);
        if (statElement)
        {
            const currentValue = parseInt(statElement.textContent);
            statElement.textContent = (currentValue + value).toString();
        }
    });
}

function updateYearSummary(year)
{
    // In a real application, you would fetch the data for the selected year
    // For now, we'll just update the display
    const yearSummary = document.querySelector('.year-summary');
    // Update summary stats as needed
}

function updateMonthCard(card, stats)
{
    const allGoodMark = card.querySelector('.inline-summary .all-good');
    let allZero = true;
    
    Object.entries(stats).forEach(([key, value]) =>
    {
        const statElement = card.querySelector(`.inline-summary [data-type="${key}"] .stat-value`);
        if (statElement) {
            statElement.textContent = value.toString();
            // Update visibility of the parent stat-item
            const statItem = statElement.closest('.stat-item');
            if (value === 0) {
                statItem.classList.add('hidden');
            } else {
                statItem.classList.remove('hidden');
                allZero = false;
            }
        }
    });

    // Show/hide tick mark based on all values being zero
    if (allGoodMark) {
        if (allZero) {
            allGoodMark.classList.remove('hidden');
        } else {
            allGoodMark.classList.add('hidden');
        }
    }
}

function updateWeekCard(card)
{
    const stats = {
        absent: Math.floor(Math.random() * 3),
        punchMissing: Math.floor(Math.random() * 4),
        late: Math.floor(Math.random() * 5)
    };

    const allGoodMark = card.querySelector('.inline-summary .all-good');
    let allZero = true;

    Object.entries(stats).forEach(([key, value]) =>
    {
        const statElement = card.querySelector(`.inline-summary [data-type="${key}"] .stat-value`);
        if (statElement) {
            statElement.textContent = value.toString();
            // Update visibility of the parent stat-item
            const statItem = statElement.closest('.stat-item');
            if (value === 0) {
                statItem.classList.add('hidden');
            } else {
                statItem.classList.remove('hidden');
                allZero = false;
            }
        }
    });

    // Show/hide tick mark based on all values being zero
    if (allGoodMark) {
        if (allZero) {
            allGoodMark.classList.remove('hidden');
        } else {
            allGoodMark.classList.add('hidden');
        }
    }
}

// Add event listeners to week headers for accordion functionality
document.querySelectorAll('.week-header').forEach(header =>
{
    header.addEventListener('click', () =>
    {
        const weekCard = header.closest('.week-card');
        const content = weekCard.querySelector('.week-content');
        const expandIcon = header.querySelector('.expand-icon');

        // Toggle the active class
        weekCard.classList.toggle('active');

        // Rotate the expand icon
        if (weekCard.classList.contains('active'))
        {
            expandIcon.style.transform = 'rotate(90deg)';
            // Populate days if not already populated
            if (content.children.length === 0)
            {
                populateDays(content);
            }
        } else
        {
            expandIcon.style.transform = 'rotate(0deg)';
        }
    });
});

// Function to populate days in a week
function populateDays(weekContent)
{
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    daysOfWeek.forEach(day =>
    {
        const dayElement = document.createElement('div');
        dayElement.className = 'day-row';
        dayElement.innerHTML = `
            <div class="day-name">${ day }</div>
            <div class="day-status">
                <div class="stat-item" data-type="absent">
                    <span class="stat-label">A:</span>
                    <span class="stat-value">0</span>
                </div>
                <div class="stat-item" data-type="punch-missing">
                    <span class="stat-label">PM:</span>
                    <span class="stat-value">0</span>
                </div>
                <div class="stat-item" data-type="late">
                    <span class="stat-label">L:</span>
                    <span class="stat-value">0</span>
                </div>
            </div>
        `;
        weekContent.appendChild(dayElement);
    });
}

// Add this function to handle stat visibility
function updateStatVisibility() {
    // Get all stat items
    const statItems = document.querySelectorAll('.stat-item');
    
    statItems.forEach(item => {
        const valueElement = item.querySelector('.stat-value');
        const value = parseInt(valueElement.textContent);
        
        // Hide if value is 0, show if greater than 0
        if (value === 0) {
            item.classList.add('hidden');
        } else {
            item.classList.remove('hidden');
        }
    });
} 