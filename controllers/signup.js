const User = require('../models/user');
const Organization = require('../models/organization');
const escape = require('../utils');

async function addUser(req, res) {
    const firstName = escape(req.body.firstName);
    const lastName = escape(req.body.lastName);
    const email = escape(req.body.email);
    const password = escape(req.body.password);
    const password2 = escape(req.body.confirmPassword);
    if(!(password === password2)) {
        res.render('signup', {
            locals: {
                alert: '',
                alert2: 'd-none',
                orgAlert: 'd-none',
                orgAlert2: 'd-none',
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
                orgEmail: '',
                description: '',
                url: '',
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
                tabUser: `active`,
                tabOrg: '',
                showUser: 'tab-pane fade active show',
                showOrg: 'tab-pane fade',
                message: 'Sign up.',
                signup: '',
                login: '',
                favorite: 'd-none',
                ad: 'd-none',
                dogs: 'd-none',
                logout: 'd-none',
                id: ''
            }
        });
    } else {
        const checkEmail = await User.getByEmail(req.body.email);
        if (checkEmail === null) {
            const addUser = await User.add(firstName, lastName, email, password, null);
            console.log(addUser);
            const instanceUser = new User(addUser.id, addUser.first_name, addUser.last_name, addUser.email, addUser.password, null);
            console.log(instanceUser);
            await instanceUser.setPassword(password);
            await instanceUser.save();
            const theEmail = escape(req.body.email);
            const theUser = await User.getByEmail(theEmail);
            req.session.user = theUser.id;
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            res.render('signup', {
                locals: {
                    alert: 'd-none',
                    alert2: '',
                    orgAlert: 'd-none',
                    orgAlert2: 'd-none',
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    phone: '',
                    orgEmail: '',
                    description: '',
                    url: '',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    tabUser: `active`,
                    tabOrg: '',
                    showUser: 'tab-pane fade active show',
                    showOrg: 'tab-pane fade',
                    message: 'Sign up.',
                    signup: '',
                    login: '',
                    favorite: 'd-none',
                    ad: 'd-none',
                    dogs: 'd-none',
                    logout: 'd-none',
                    id: ''
                }
            });
        }
    }
}

async function checkLogin(req, res) {
    if (req.session.user) {
        const userInstance = await User.getById(req.session.user);
        if (userInstance.orgId) {
            res.render('error', {
                locals: {
                    message: "Already signed up as an organization.",
                    signup: 'd-none',
                    login: 'd-none',
                    favorite: 'd-none',
                    ad: '',
                    dogs: '',
                    logout: '',
                    id: userInstance.orgId
                }
            });
        } else if (userInstance.orgId === null) {
            res.render('error', {
                locals: {
                    message: "Already signed up as a user.",
                    signup: 'd-none',
                    login: 'd-none',
                    favorite: '',
                    ad: 'd-none',
                    dogs: 'd-none',
                    logout: '',
                    id: ''
                }
            });
        }
    } else {
        res.render('signup', {
            locals: {
                alert: 'd-none',
                alert2: 'd-none',
                orgAlert: 'd-none',
                orgAlert2: 'd-none',
                name: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                phone: '',
                orgEmail: '',
                description: '',
                url: '',
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                tabUser: `active`,
                tabOrg: '',
                showUser: 'tab-pane fade active show',
                showOrg: 'tab-pane fade',
                message: "Sign up.",
                signup: '',
                login: '',
                favorite: 'd-none',
                ad: 'd-none',
                dogs: 'd-none',
                logout: 'd-none',
                id: ''
            }
        });
    }
}

async function addOrganization(req, res) {
    const name = escape(req.body.name);
    const address = escape(req.body.address);
    const city = escape(req.body.city);
    const state = escape(req.body.state);
    const zip = escape(req.body.zip);
    const phone = escape(req.body.phone);
    const orgEmail = escape(req.body.orgEmail);
    const orgPassword = escape(req.body.orgPassword);
    const orgPassword2 = escape(req.body.confirmOrgPassword);
    const description = escape(req.body.description);
    const url = escape(req.body.url);

    if(!(orgPassword === orgPassword2)) {
        res.render('signup', {
            locals: {
                alert: 'd-none',
                alert2: 'd-none',
                orgAlert: '',
                orgAlert2: 'd-none',
                name: name,
                address: address,
                city: city,
                state: state,
                zip: zip,
                phone: phone,
                orgEmail: orgEmail,
                description: description,
                url: url,
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                tabUser: ``,
                tabOrg: 'active',
                showUser: 'tab-pane fade',
                showOrg: 'tab-pane fade active show',
                message: 'Sign up.',
                signup: '',
                login: '',
                favorite: 'd-none',
                ad: 'd-none',
                dogs: 'd-none',
                logout: 'd-none',
                id: ''
            }
        });
    } else {
        const checkEmail = await User.getByEmail(req.body.orgEmail);
        if (checkEmail === null) {
            // Create new Organization
            const addOrgan = await Organization.addOrganization(name, address, city, state, zip, phone, orgEmail, 'orgPassword', description, url); // Prevents showing password unhashed
            console.log(addOrgan);

            // This will create an Organization Instance
            const instanceOrgan = new Organization(addOrgan.id, addOrgan.name, addOrgan.address, addOrgan.city, addOrgan.state, addOrgan.zip, addOrgan.phone, addOrgan.email, addOrgan.password, addOrgan.description, addOrgan.website);
            console.log(instanceOrgan);

            // Create new User
            const orgUser = await User.add(instanceOrgan.name, instanceOrgan.name, instanceOrgan.email, instanceOrgan.password, instanceOrgan.id);
            console.log(orgUser);
            
            // User Instance
            const instanceUserOrg = new User(orgUser.id, orgUser.first_name, orgUser.last_name, orgUser.email, orgUser.password, orgUser.org_id);
            console.log(instanceUserOrg);

            // Hash Pass
            await instanceUserOrg.setPassword(orgPassword);
            await instanceUserOrg.save();

            const theEmail = escape(req.body.orgEmail);
            const theUser = await User.getByEmail(theEmail);
            req.session.user = theUser.id;
            req.session.save(() => {
                res.redirect('/');
            });
        } else {
            res.render('signup', {
                locals: {
                    alert: 'd-none',
                    alert2: 'd-none',
                    orgAlert: 'd-none',
                    orgAlert2: '',
                    name: name,
                    address: address,
                    city: city,
                    state: state,
                    zip: zip,
                    phone: phone,
                    orgEmail: orgEmail,
                    description: description,
                    url: url,
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    tabUser: ``,
                    tabOrg: 'active',
                    showUser: 'tab-pane fade',
                    showOrg: 'tab-pane fade active show',
                    message: 'Sign up.',
                    signup: '',
                    login: '',
                    favorite: 'd-none',
                    ad: 'd-none',
                    dogs: 'd-none',
                    logout: 'd-none',
                    id: ''
                }
            });
        }
    }
}

module.exports = {
    addUser,
    checkLogin,
    addUser,
    addOrganization
}