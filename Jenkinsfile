pipeline {
    agent any
    stages {

      

      
    stage('Clone repository') {
        /* Cloning the Repository to our Workspace */

        checkout scm
    } 

        stage('Build Prod Image') {
            steps {
                echo 'Building Prod Web Image....'
                sh 'docker build -t hessine/dock-hand .'
            }
        }

        stage('Send Prod Image to Docker Hub') {
            steps {
                sh '''
                echo 'Pushing Image to Docker Hub'
                docker push hessine/dock-hand
                '''
            }
        }
    }
}

