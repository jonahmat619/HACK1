
## HTML element legend

| Element | Purpose in this page |
| --- | --- |
| `a` | Workspace navigation link to today's tracker. |
| `aside` | Sidebar and secondary roommate/reminder content. |
| `body` | Visible page content. |
| `button` | Add, remove, reminder, trade, and form-action controls. |
| `div` | Generic layout and grouping containers. |
| `form` | Chore, roommate, and trade input groups. |
| `h1`, `h2` | Page and section headings. |
| `head` | Document metadata and title. |
| `header` | Date and roommate-avatar row. |
| `html` | Root document element; declares English with `lang="en"`. |
| `input` | Chore name, roommate name, phone number, and completion checkbox fields. |
| `label` | Accessible names for form fields. |
| `li` | A chore, roommate, or empty-state list item. |
| `main` | Primary tracker content. |
| `meta` | Character encoding and responsive viewport metadata. |
| `nav` | Workspace navigation. |
| `option` | Initial choices in select controls. |
| `p` | Supporting text, descriptions, notices, and date placeholder. |
| `progress` | Native progress-bar placeholder, initially set to 0 of 100. |
| `section` | The welcome, progress, chore, roommate, reminder, and trade areas. |
| `select` | Chore assignee and trade selection controls. |
| `span` | Inline labels, values, icons, and template content. |
| `strong` | Emphasized empty-state and sidebar messages. |
| `template` | Inert starter markup for future JavaScript to clone into the chore and roommate lists. |
| `title` | Browser tab title. |
| `ul` | Chore and roommate lists. |

## Class legend

### Page layout and navigation

| Class | Purpose |
| --- | --- |
| `shell` | Overall page wrapper. |
| `sidebar` | Main navigation and sidebar content. |
| `brand` | Brand name and mark grouping. |
| `brand-mark` | Brand icon/letter. |
| `brand-name` | Brand text. |
| `nav-label` | Sidebar navigation section label. |
| `nav-item` | Workspace navigation link. |
| `active` | Marks the current navigation item. |
| `nav-icon` | Navigation icon. |
| `sidebar-bottom` | Content anchored at the bottom of the sidebar. |
| `sidebar-note` | Sidebar encouragement callout. |
| `note-icon` | Sidebar callout icon. |
| `sidebar-foot` | Sidebar footer text. |
| `topbar` | Date and roommate-avatar row. |
| `date-label` | Date display hook. |
| `avatar-stack` | Roommate initials/avatar group. |
| `content` | Main content-width wrapper. |
| `welcome` | Page introduction area. |
| `eyebrow` | Small introductory label above the page title. |
| `subtitle` | Supporting text under the page title. |
| `today-pill` | Today/date badge. |
| `workspace` | Main chores and roommate columns. |
| `right-column` | Roommate and reminder column. |

### Progress and shared components

| Class | Purpose |
| --- | --- |
| `overview` | Daily progress and summary area. |
| `progress-card` | Progress indicator and explanatory text wrapper. |
| `ring` | Progress-circle container hook. |
| `ring-content` | Text placed inside the progress circle. |
| `ring-value` | Completion percentage text. |
| `ring-caption` | Progress-circle caption. |
| `progress-copy` | Progress heading and description. |
| `mini-stats` | Summary statistics group. |
| `stat-card` | One summary statistic. |
| `stat-icon` | Summary statistic icon. |
| `stat-number` | Summary statistic value. |
| `stat-label` | Summary statistic caption. |
| `section-heading` | Heading row for a content section. |
| `section-meta` | Small count or metadata beside a section heading. |
| `panel` | Bordered-content panel hook. |
| `primary-button` | Main action button. |
| `secondary-button` | Secondary action button. |
| `notice` | Status-message area for future behavior. |
| `empty-state` | Placeholder shown when a list has no entries. |

### Chores and trade controls

| Class | Purpose |
| --- | --- |
| `task-list` | Chore list. |
| `task` | One chore item in the task template. |
| `task-check` | Chore completion checkbox. |
| `task-title` | Chore name. |
| `task-assignee` | Assigned roommate or unassigned label. |
| `assignee-dot` | Decorative assignee marker. |
| `task-actions` | Chore action buttons group. |
| `icon-button` | Compact chore action button. |
| `reminder` | Reminder action hook. |
| `trade` | Trade/reassignment action hook. |
| `delete` | Remove-chore action hook. |
| `add-task-form` | Add-chore form. |
| `dialog-inner` | Trade form content wrapper; retained as a styling hook. |
| `dialog-actions` | Trade form action buttons group. |

### Roommates and reminders

| Class | Purpose |
| --- | --- |
| `roommate-heading` | Roommate list heading row. |
| `roommate-list` | Roommate list. |
| `roommate-row` | One roommate item in the roommate template. |
| `roommate-initial` | Roommate initial/avatar. |
| `roommate-info` | Roommate name and phone grouping. |
| `roommate-name` | Roommate name. |
| `roommate-phone` | Roommate phone number. |
| `roommate-remove` | Remove-roommate action hook. |
| `add-roommate-form` | Add-roommate form. |
| `form-pair` | Roommate name and phone field grouping. |
| `reminder-note` | Reminder explanation area. |

## ID legend

IDs are unique hooks for links, labels, accessibility relationships, and future JavaScript. Keep them unique if you duplicate any markup.

| ID | Element / purpose |
| --- | --- |
| `today` | Main tracker destination for the navigation link. |
| `avatar-stack` | Roommate avatar container. |
| `page-title` | Main page heading and welcome-section label target. |
| `progress-ring` | Progress-circle wrapper. |
| `progress-value` | Percentage text inside the circle. |
| `progress-meter` | Native progress bar; `value` and `max` represent completion. |
| `progress-title` | Progress summary heading. |
| `progress-description` | Progress summary text. |
| `done-count` | Completed chore count. |
| `remaining-count` | Incomplete chore count. |
| `chores-heading` | Chore section heading and label target. |
| `task-count` | Chore count text. |
| `task-list` | Chore list container. |
| `task-form` | Add-chore form. |
| `task-title` | Chore-name input and its label target. |
| `task-assignee` | Roommate assignment select and its label target. |
| `notice` | Live status-message region. |
| `roommates-heading` | Roommate section heading and label target. |
| `roommate-count` | Roommate count text. |
| `roommate-list` | Roommate list container. |
| `roommate-form` | Add-roommate form. |
| `roommate-name` | Roommate-name input and its label target. |
| `roommate-phone` | Phone-number input and its label target. |
| `reminder-heading` | Reminder area heading and label target. |
| `trade-title` | Trade section heading and label target. |
| `trade-form` | Trade-selection form. |
| `trade-chore` | Chore to hand off or trade. |
| `trade-roommate` | Roommate to trade with. |
| `trade-partner-chore` | Optional chore to swap with. |
| `cancel-trade` | Resets the trade form choices. |
| `task-template` | Starter markup for a chore item. |
| `roommate-template` | Starter markup for a roommate item. |
