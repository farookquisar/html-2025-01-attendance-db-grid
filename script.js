document.addEventListener('DOMContentLoaded', () =>
{
    // Initialize week cards
    initializeWeekCards();
    // Initialize year and month selection
    initializeYearMonthSelection();
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
            // Remove active class from all year cards
            yearCards.forEach(c => c.classList.remove('active'));

            // Add active class to clicked card
            card.classList.add('active');

            // Show year summary
            yearSummary.classList.add('active');

            // Update summary stats based on selected year
            updateYearSummary(card.dataset.year);
        });
    });

    // Month selection
    const monthCards = document.querySelectorAll('.month-card');
    const monthSummary = document.querySelector('.month-summary');
    const selectedMonthSpan = document.querySelector('.selected-month');

    monthCards.forEach(card =>
    {
        card.addEventListener('click', () =>
        {
            monthCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            // Update stats for this month
            const stats = {
                absent: Math.floor(Math.random() * 5),
                punchMissing: Math.floor(Math.random() * 7),
                late: Math.floor(Math.random() * 10)
            };
            updateMonthCard(card, stats);
        });
    });

    // Set initial active states
    yearCards[0].click(); // Activate first year by default
    monthCards[0].click(); // Activate first month by default
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
    Object.entries(stats).forEach(([key, value]) =>
    {
        const statElement = card.querySelector(`.inline-summary [data-type="${ key }"] .stat-value`);
        if (statElement)
        {
            statElement.textContent = value.toString();
        }
    });
}

function updateWeekCard(card)
{
    const stats = {
        absent: Math.floor(Math.random() * 3),      // Random demo data
        punchMissing: Math.floor(Math.random() * 4),
        late: Math.floor(Math.random() * 5)
    };

    // Update the stats in the summary
    Object.entries(stats).forEach(([key, value]) =>
    {
        const statElement = card.querySelector(`.inline-summary [data-type="${ key }"] .stat-value`);
        if (statElement)
        {
            statElement.textContent = value.toString();
        }
    });
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