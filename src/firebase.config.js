import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFireStore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: 'AIzaSyDgoFG1Nyd0D7M6aj4DlzyiUVvdO9OEeB8',
	authDomain: 'house-marketplace-app-8f685.firebaseapp.com',
	projectId: 'house-marketplace-app-8f685',
	storageBucket: 'house-marketplace-app-8f685.appspot.com',
	messagingSenderId: '606066841653',
	appId: '1:606066841653:web:f5100a0bbc5b8d343e797c',
	measurementId: 'G-HVJBLRL6BV',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFireStore(app);
const analytics = getAnalytics(app);
