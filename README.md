<div align="center">

  <img src="https://github.com/user-attachments/assets/36a6923a-0e28-41ea-8e84-d07e1571a545" alt="bill2" width="300" />
  <h1>SplitBills</h1>
  
  <p>
    Full stack Bill Splitting web application
  </p>
  
</div>

<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About the Project](#star2-about-the-project)
  * [Features](#rocket-features)
  * [Tech Stack](#space_invader-tech-stack)
- [Getting Started](#toolbox-getting-started)
  * [Prerequisites](#bangbang-prerequisites)
  * [Installation](#gear-installation)
  * [Running Tests](#test_tube-running-tests)
  * [Run Locally](#running-run-locally)
- [License](#warning-license)

  
<!-- About the Project -->
## :star2: About the Project

<!-- Usage -->
### :rocket: Features

This application was created to help users manage their debts and track expenses within groups, making it easier to split bills among friends or family.

Users must first log in or register, then they can interact with the web application.

The application allows users to create groups and add bills that can be shared among group members. Each user can see what they owe and what others owe them, facilitating clear financial communication.

### Video Demos

- **Authentication**: Demonstrates the login process with a Google Account.
  https://github.com/user-attachments/assets/e81773f3-9030-4d75-8b94-d173d84c7115
  https://github.com/user-attachments/assets/8c2eaf3f-0c21-47fe-a8b3-2ac787f49e58

- **Create Group**: Illustrates the process of creating a new group for splitting bills.
  https://github.com/user-attachments/assets/a269c4bf-0516-4d23-882a-671786c47588

- **Create Bill**: Shows how to create a new bill in the application.
  https://github.com/user-attachments/assets/e6784ae2-8c94-49b6-91fe-e555618ebcf0

- **Edit Group**: Displays how to edit group details after creation.
  https://github.com/user-attachments/assets/812a4c31-29cd-46c1-8617-e1a594a31690

- **Update/Delete Bill**: Explains how to update or delete an existing bill.
  https://github.com/user-attachments/assets/8158f911-1636-42cc-89e0-835c47361f86

- **View Debts**: Shows how users can view their debts and what is owed to them.
  https://github.com/user-attachments/assets/b320eb74-2f41-4d06-9677-458f89358875

The app is designed to provide a user-friendly interface for tracking who owes what, ensuring that managing shared expenses is hassle-free. Users can view detailed information about each bill, including amounts and recipients, making it easier to settle up with friends.

<!-- TechStack -->
### :space_invader: Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://reactjs.org/">React.js</a></li>
    <li><a href="https://mui.com/">Material-UI</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://spring.io/projects/spring-boot">Spring Boot</a></li>
    <li><a href="https://maven.apache.org/">Maven</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://www.postgresql.org/">PostgreSQL</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
    <li><a href="https://docs.github.com/en/actions">GitHub Actions</a></li>
  </ul>
</details>

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project requires Node.js, Docker, and Maven to be installed.

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://docs.docker.com/get-docker/)
- [Maven](https://maven.apache.org/download.cgi)

<!-- Installation -->
### :gear: Installation

Clone the project

```bash
git clone https://github.com/yh13431/splitbills.git
cd splitbills
```

#### Backend Setup (Spring Boot)

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies using Maven:

   ```bash
   mvn install
   ```

3. Run the Spring Boot application:

   ```bash
   mvn spring-boot:run
   ```

#### Frontend Setup (React)

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React application:

   ```bash
   npm start
   ```

<!-- Running Tests -->
### :test_tube: Running Tests

To run tests for the backend, use the following command in the backend directory:

```bash
mvn test
```

For the frontend, run:

```bash
npm test
```

<!-- Run Locally -->
### :running: Run Locally

1. Clone the project

   ```bash
   git clone https://github.com/yh13431/splitbills.git
   ```

2. Navigate to the project directory:

   ```bash
   cd splitbills
   ```

3. Start the application using Docker Compose:

   ```bash
   docker-compose up
   ```

4. Access the application at `http://localhost:3000` for the React frontend and the Spring Boot API at `http://localhost:8080`.


<!-- License -->
## :warning: License

Distributed under the MIT License. See [LICENSE](https://github.com/yh13431/splitbills/blob/main/LICENSE.md) for more information.
