pipeline {
  agent any
    
  tools {nodejs "Node"}
    
  stages {
        
    stage('Cloning Git') {
      steps {
        git branch: 'main', credentialsId: 'jenkins_key', url: 'git@github.com:ObiKerui/D3PlotLib.git'
      }
    }
        
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
     
    stage('Test') {
      steps {
         sh 'npm test'
      }
    }      
  }
}