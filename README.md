<a name="readme-top"></a>
<h1 align="center"><b>WebTalk Messenger</b></h1>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#projects-functionality-and-features">Project's Functionality and Features</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation-steps">Installation Steps</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
  </ol>
</details>


<!-- About The Project -->
## About The Project
<p>This repository is a FRONT-END ReactJS part of a safe and secure messeneger project for a real-time communication between users.</p>
<p>
  Safety of communication is achieved by encrypting messages before sending them to other users. For this purpose messenger uses a combination of asymmetric and symmetric encryption methods.
</p>


<!-- Project's Functionality and Features -->
## Project's Functionality and Features

* **USER Account features**

    - **Registration** with account activation via user's email.

    - **Authentication** based on **JWTs (JSON Web Tokens)**.

    - **Real-time encrypted messaging** using **WebSocket** connection.

    - **Chat's members hierarchy** based on roles.

    - **Messages managment** with options to delete and update previously sent messages in real-time communication.

    - **Subscription managment** with ability for users to subscribe to other users and track own subscriptions and subscribers.

    - **Account modification functionality**

    - **Posts creation functionality**

* **ADMIN panel features**

    - **User management** with functionality to block and delete user's accounts by admins.

    - **ADMIN creation functionality**: Admins can create other admins to assist in managing the platform
    
    - **ADMIN's account modification functionality**

* **ROOT panel features** (**ROOT** is the main **ADMIN** with the most rights in the system)

    - **All** functionality of a regular **ADMIN**.

    - **ADMIN's deletion functionality**: ROOT can delete other admins in the system

<br/>


<h2 align="center">Registration and authentication</h2>

<h3>Registration and authentication steps:</h3>
<ol>
  <li>Move to <code>Sign Up</code> tab.</li>
  <li>Fill in and submit the registration form.</li>
  <li>Check your email for account activation code.</li>
  <li>Activate account by following the link in the email and entering the activation code in the provided field.</li>
  <li>Authenticate in messenger by moving to the <code>Sign in</code> tab and filling in the form with data provided during registration process.</li>
</ol>

<h3><code>Registration form</code></h3>
<img src="assets/registration-form.png" alt="Registration form" width="100%" title="Registration form">

<br/>

<h3><code>Message after registration</code></h3>
<img src="assets/message-after-registration.png" alt="Message after registration" width="100%" title="Message after registration">

<br/>

<h3><code>Account activation email</code></h3>
<img src="assets/registration-email.png" alt="Account activation email" width="100%" title="Account activation email">

<br/>

<h3><code>Activation code field</code></h3>
<img src="assets/activation-code-field.png" alt="Activation code field" width="100%" title="Activation code field">

<br/>

<h2 align="center">Account modification</h2>
<ol>
  <li>Press <code>modify</code> button</li>
  <li>Fill in and submit the modification form.</li>
  <li>Provide your current password for modification</li>
  <li>Submit the form</li>
</ol>
<br/>
<img src="assets/account-modification.gif" alt="Account modification" style="width: 100%">

<br/>

<h2 align="center">Post functionality</h2>
<h3><code>User can create posts on different topics and publish them on his/her profile page.</code></h3>
<img src="assets/post-functionality.gif" alt="Post functionality" style="width: 100%">

<br/>

<h2 align="center">Subscription functionality</h2>
<h3><code>User can subscribe to other users for quick access to profiles of other users in order to check posts or write messages to them.</code></h3>
<img src="assets/subscription-functionality.gif" alt="Subscription functionality" style="width: 100%">

<br/>

<h2 align="center">Messaging in chat</h2>
<h3>Messaging functionality:</h3>
<ul>
  <li>Write messages.</li>
  <li>Use emojis.</li>
  <li>Update or delete messages.</li>
  <li>Make admins (Accessable only for admins in chat).</li>
  <li>Change chat name (Accessable only for admins in chat).</li>
  <li>Add users to chat.</li>
  <li>Delete users from chat (Accessable only for admins in chat.)</li>
</ul>
<img src="assets/messaging-in-chat.gif" alt="Messaging in chat" style="width: 100%">

<br/>

<h3><code>User's chats.</code></h3>
<img src="assets/chats.png" alt="Chats" width="100%" height="100%" title="Chats">

<br/>

<h3><code>Users route:</code> All users in messenger except the current one.</h3>
<img src="assets/users.png" alt="Users" width="100%" height="100%" title="Users">

<br/>

<h2 align="center">Admin routes</h2>
<h3><code>Admin routes are accessible only for users with role: ADMIN or ROOT.</code></h3>
<img src="assets/admin-panel.png" alt="Admin panel" width="100%" height="100%" title="Admin panel">

<br/>

<h3><code>Admins route:</code> All admins in messenger except the current one.</h3>
<img src="assets/admins.png" alt="Admins" width="100%" height="100%" title="Admins">

<br/>

<h3><code>ADMINs can delete or block account of another user in messenger.</code></h3>
<img src="assets/another-user-page-for-admin.png" alt="Another user page for admin" width="100%" height="100%" title="Another user page for admin">

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Getting Started -->
## Getting Started

### Prerequisites

<ul>
  <li>Node.js</li>
  <li>
    <div>BACK-END project</div>
    <div>
      <code>In order to properly set up the BACK-END project follow this link: <a href="https://github.com/AndriiHliuza/messenger/tree/dev">BACK-END</a></code>
    </div>
  </li>
</ul>


### Installation steps
1. Clone the repository.
```
git clone https://github.com/AndriiHliuza/messenger-frontend-app.git
```

2. Navigate to the project's directory.
```
cd messenger-frontend-app
```

3. Install dependencies
```
npm install
```

4. Run the server
```
npm start
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- Usage -->
## Usage
* Open browser and navigate to http://localhost:3000

<p align="right">(<a href="#readme-top">back to top</a>)</p>
