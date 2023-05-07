SETUP INSTRUCTIONS

Note: Please extract all files from the zip file.

a. Creating the SP Air database
	1. Open MySQL Workbench and open up Local Instance.

	2. Create a new SQL tab by clicking on the 1st icon at the top.

	3. Drag the 'sql-script' file included in the 'Documents' folder into the SQL tab.

	4. Execute the script by clicking on the lightning icon right above the script.

	5. Under the Navigator menu on the left, click the refresh icon beside 'SCHEMAS'.

	6. There should be 5 tables created under the 'sp_air' schema.

b. Starting the servers
	1. Open Visual Studio Code. Under the file menu, click on 'Open Folder' 
	   and open the 'SP Air' folder.

	2. Under the Terminal menu, click on 'New Terminal' to start a terminal.

	3. Type the following commands in order:
	   	
	   cd express-server

	   node server.js

	   into the terminal to start the back-end server.

	4. Under the Terminal menu, click on 'New Terminal' to start another terminal.

	5. Type the following commands in order:

	   cd front-end

	   node server.js

	   into the terminal to start the front-end server.

	6. Open Google Chrome and enter 'http://localhost:3001' into the URL bar.

	7. You can explore the website from there. Some accounts you can use to log into the website:

	   Role: Customer
	   Email: lilytay@gmail.com
	   Password: lily

	   Role: Admin
	   Email: bob@gmail.com
	   Password: bob

