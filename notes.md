**Product Requirements Document (PRD): Fantasy Premier League (FPL) Web App**

---

### **1. Overview**

The Fantasy Premier League (FPL) web app will allow users to enter their FPL Team ID or League ID and retrieve basic data from the FPL API. The app will support both regular FPL and FPL Draft modes. The focus of this document is to provide a detailed step-by-step guide to build the app, including handling edge cases, potential errors, logging, and sample code snippets. Initial emphasis is on data retrieval, with styling deferred to later stages.

---

### **2. Objectives**

1. Retrieve and display basic FPL data (team or league data).
2. Ensure compatibility with both regular and draft FPL modes.
3. Implement robust error handling and logging.
4. Use Cursor as the development platform.

---

### **3. Technical Requirements**

- **Frontend:** HTML, CSS, Tailwind CSS (basic styling initially)
- **Backend:** Node.js
- **API Integration:** FPL API
- **Platform:** Cursor
- **Version Control:** Git
- **Libraries/Tools:** Axios or Fetch for API calls, dotenv for managing environment variables

---

### **4. Key Features**

1. Input form for entering Team ID or League ID.
2. Fetch and display basic data (team name, points, league rankings, etc.).
3. Toggle functionality for regular FPL and FPL Draft modes.
4. User-friendly error messages for invalid inputs or API failures.
5. Logging to track errors and user actions.

---

### **5. Step-by-Step Development Plan**

#### **Step 1: Set Up the Development Environment**

1. Create a new project in Cursor.
2. Set up a Node.js server:
   - Initialize the project with `npm init`.
   - Install necessary packages: `npm install express axios dotenv @radix-ui/react-icons class-variance-authority clsx tailwind-merge`.
3. Create the following folder structure:
   - `/src`: Contains server-side code.
   - `/public`: Contains frontend files (HTML, CSS).
   - `.env`: For storing API-related configurations securely.

#### **Step 2: Create the Backend Server**

1. **Set Up Express Server**

   ```javascript
   const express = require("express");
   const axios = require("axios");
   const dotenv = require("dotenv");

   dotenv.config();

   const app = express();
   app.use(express.json());

   const PORT = process.env.PORT || 3000;

   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
   ```

2. **Define Routes**

   - `POST /api/team`: Retrieve data for a given Team ID.
   - `POST /api/league`: Retrieve data for a given League ID.

3. **Environment Variables**

   - Store API base URL in `.env` file:
     ```
     FPL_API_BASE=https://fantasy.premierleague.com/api/
     ```

#### **Step 3: Build the API Integration**

1. **Fetch Team Data**

   ```javascript
   app.post("/api/team", async (req, res) => {
     const { teamId } = req.body;

     try {
       if (!teamId) {
         return res.status(400).json({ error: "Team ID is required." });
       }

       const response = await axios.get(
         `${process.env.FPL_API_BASE}entry/${teamId}/`
       );

       res.status(200).json({
         teamName: response.data.name,
         points: response.data.summary_overall_points,
       });
     } catch (error) {
       console.error("Error fetching team data:", error);
       res.status(500).json({
         error: "Unable to fetch team data. Please check the Team ID.",
       });
     }
   });
   ```

2. **Fetch League Data**

   ```javascript
   app.post("/api/league", async (req, res) => {
     const { leagueId } = req.body;

     try {
       if (!leagueId) {
         return res.status(400).json({ error: "League ID is required." });
       }

       const response = await axios.get(
         `${process.env.FPL_API_BASE}leagues-classic/${leagueId}/standings/`
       );

       res.status(200).json({
         leagueName: response.data.league.name,
         standings: response.data.standings.results,
       });
     } catch (error) {
       console.error("Error fetching league data:", error);
       res.status(500).json({
         error: "Unable to fetch league data. Please check the League ID.",
       });
     }
   });
   ```

#### **Step 4: Build the Frontend**

1. **Create Basic HTML Structure**

   ```html
   <!DOCTYPE html>
   <html>
     <head>
       <title>FPL Web App</title>
       <link
         href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
         rel="stylesheet"
       />
     </head>
     <body class="bg-gray-100">
       <div class="container mx-auto mt-10">
         <h1 class="text-2xl font-bold">Fantasy Premier League App</h1>
         <form id="fpl-form" class="mt-5">
           <label class="block">Enter ID (Team or League):</label>
           <input
             type="text"
             id="input-id"
             class="border p-2 mt-2 w-full"
             placeholder="e.g., 123456"
           />
           <select id="input-type" class="border p-2 mt-2 w-full">
             <option value="team">Team</option>
             <option value="league">League</option>
           </select>
           <button type="submit" class="bg-blue-500 text-white px-4 py-2 mt-3">
             Submit
           </button>
         </form>
         <div id="output" class="mt-5"></div>
       </div>
     </body>
     <script src="app.js"></script>
   </html>
   ```

2. **Frontend Logic (app.js)**

   ```javascript
   document.getElementById("fpl-form").addEventListener("submit", async (e) => {
     e.preventDefault();

     const inputId = document.getElementById("input-id").value;
     const inputType = document.getElementById("input-type").value;
     const outputDiv = document.getElementById("output");

     outputDiv.innerHTML = "Loading...";

     try {
       const response = await fetch(`/api/${inputType}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ [`${inputType}Id`]: inputId }),
       });

       const data = await response.json();

       if (response.ok) {
         outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
       } else {
         outputDiv.innerHTML = `<p class='text-red-500'>${data.error}</p>`;
       }
     } catch (error) {
       outputDiv.innerHTML = `<p class='text-red-500'>An error occurred. Please try again later.</p>`;
     }
   });
   ```

#### **Step 5: Add Error Handling and Logging**

1. **Backend Logging**
   Use `console.error` to log errors and capture relevant details (e.g., request payload).

2. **Edge Cases**

   - Empty input field.
   - Invalid Team ID or League ID.
   - API rate limits.
   - Network issues.

3. **User Feedback**

   - Display appropriate messages for each error scenario.

---

### **6. Testing Plan**

1. Test with valid and invalid Team IDs and League IDs.
2. Simulate API failures (e.g., by disabling the internet) and verify error messages.
3. Validate frontend form inputs.
4. Verify behavior for both regular FPL and FPL Draft.

---

### **7. Future Enhancements**

1. Add advanced data visualizations (e.g., charts for performance).
2. Allow users to save favorite teams/leagues.
3. Add a dark mode for styling.
4. Enable login functionality for personalized experiences.

---
