pipeline {
    agent any
    stages {

        stage('Using Docker Credentials') {
            steps {
                echo 'LOGGING INTO DOCKER................'
                sh'cat ~/my_creds.txt | docker login --username hessine --password-stdin'
            }
        }

        // stage('Build Dev Image For Testing') {
        //     steps {
        //         sh 'docker build -t hessine/dock-hand-dev -f Dockerfile.dev .'
        //     }
        // }

        // stage('Run Web Tests') {
        //     steps {
        //         sh 'docker run hessine/dock-hand-dev npm run test-docker'
        //     }
        // }

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

