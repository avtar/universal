#!/bin/bash

set -e

# Ensure we have at least Ansible 2.4 or newer
sudo yum -y install ansible

# Retrieve Ansible roles
sudo ansible-galaxy install -fr /home/vagrant/sync/vagrant-configs/provisioning/requirements.yml

# Install CouchDB
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/vagrant-configs/provisioning/couchdb.yml --tags="install,configure,deploy"

# Install Flow Manager
sudo PYTHONUNBUFFERED=1 ansible-playbook /home/vagrant/sync/vagrant-configs/provisioning/flow-manager.yml --tags="install,configure,deploy"

# Add additional CouchDB data
which kanso || sudo npm install -g kanso
kanso upload /home/vagrant/sync/testData/dbData/clientCredentials.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/gpiiAppInstallationClients.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/gpiiKeys.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/prefsSafes.json http://localhost:5984/gpii
kanso upload /home/vagrant/sync/testData/dbData/views.json http://localhost:5984/gpii
