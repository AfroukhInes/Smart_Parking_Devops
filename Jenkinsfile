pipeline {

  agent any

  environment {
    REGISTRY = "ines234"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build Docker Images') {
      steps {
        sh 'docker build -t $REGISTRY/auth-service ./auth-service'
        sh 'docker build -t $REGISTRY/reservation-service ./reservation-service'
        sh 'docker build -t $REGISTRY/notification-service ./notification-service'
        sh 'docker build -t $REGISTRY/billing-service ./billing-service'
        sh 'docker build -t $REGISTRY/frontend ./frontend'
      }
    }

    stage('Login Docker Hub') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'dockerhub',
          usernameVariable: 'USER',
          passwordVariable: 'PASS'
        )]) {
          sh 'echo $PASS | docker login -u $USER --password-stdin'
        }
      }
    }

    stage('Push Images') {
      steps {
        sh 'docker push $REGISTRY/auth-service'
        sh 'docker push $REGISTRY/reservation-service'
        sh 'docker push $REGISTRY/notification-service'
        sh 'docker push $REGISTRY/billing-service'
        sh 'docker push $REGISTRY/frontend'
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }
}
