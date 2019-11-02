TamTamCRM is an Open Source CRM (Customer Relationship Management) software that allows you to see, enter and evaluate all your company relationships regardless of the type. People, companies or opportunities - all in an easy and intuitive interface.

It's a web application with a frontend designed as a single page application based on react.js and a REST API backend written in PHP.

Download the latest release from our website.

Requirements

PHP 7.2 and later (with pdo, json, gd, openssl, zip, imap, mbstring, curl extensions);
MySQL 5.7 (and later), or MariaDB 10.1 (and later).
For more information about server configuration see this article.

Documentation

How to report a bug

How to install a stable version

Download the latest version. See the instructions about installation.

How to get started (for developers)

Clone repository to your local computer.
Change to the project's root directory.
Install composer.
Run composer install if composer is installed globally or php composer.phar install if locally.
Never update composer dependencies if you are going to contribute code back.

Now you can build. Build will create compiled css files.

How to build (for developers)

You need to have nodejs and Grunt CLI installed.

Change to the project's root directory.
Install project dependencies with npm install.
Run Grunt with grunt.
The build will be created in the build directory.

How to contribute

Branches:

hotfix/* – upcoming maintenance release; fixes should be pushed to this branch;
master – develop branch; new features should be pushed to this branch;
stable – last stable release.

License

TamTamCRM is published under the GNU GPLv3 license.
