# Home Board Project

**Concept:** an open-source bulletin board made for a unix-based system (e.g. Raspberry Pi) to pair with a monitor and display information that can be updated easily and wirelessly

**Initial use case:** a family bulletin board where things like shopping lists, chores, important notes, and other things can be stored and displayed

# Initial design

**Software:**
- back end: 
  - a simple node server
  - use very simple data storage, not sure if flat file or not
  - an API that can be used to
    - read board information
    - update the board
- front end: 
  - HTML or React
  - Display page shows most current data
  - Admin page to directly modify data

**Hardware:**
- 22 inch (or so) monitor with HDMI connection
- Raspberry Pi with HDMI output, model likely doesn't matter


# Roadmap for initial product
- [ ] node server
- [ ] dummy data
  - [ ] family/group members
  - [ ] groceries
  - [ ] shopping
  - [ ] chores (with assigned person)
  - [ ] reminders
  - [ ] messages
- [ ] front end
- [ ] database with seeding
  - [ ] see dummy data for tables
- [ ] admin page
  - [ ] add record to existing data table
  - [ ] edit
  - [ ] archive (soft delete)


# Future feature batches


# Notes
