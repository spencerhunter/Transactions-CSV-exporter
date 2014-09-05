Getting Started
---------------

The easiest way to get started is to clone the repository:

```bash
# Clone the project into a new directory
git clone https://github.com/spencerhunter/Transactions-CSV-exporter.git myproject

cd myproject

# Install NPM dependencies
npm install

node-dev ./bin/www
```

Obtain API Key and Secret
------------------

- Go to the [Applications](https://www.dwolla.com/applications) page
- Click **Create an application** 
- Enter *Application Name*
- For *Permissions* select Transaction Details
- Agree to the TOS
- Click **create your application**
- Store your application key and secret in environment variables or hard code them in to your application


Run Application on Heroku
------------------
When deploying the application on heroku you will need to set your client_id, client_secret, and the location of your heroku app in [config vars](https://devcenter.heroku.com/articles/getting-started-with-nodejs#define-config-vars).
Example: heroku config:set HOST=http://dwolladwollabill.herokuapp.com

- heroku config:set DWOLLA_CLIENT_ID
- heroku config:set DWOLLA_CLIENT_SECRET
- heroku config:set HOST