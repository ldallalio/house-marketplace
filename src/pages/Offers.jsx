import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offer() {
	const [listings, setListings] = useState(null);
	const [loading, setLoading] = useState(true);
	const params = useParams();
	useEffect(() => {
		const fetchListings = async () => {
			try {
				//Get Reference to the collection
				const listingsRef = collection(db, 'listings');
				//Create a query to get all the listings
				const q = query(
					listingsRef,
					where('offer', '==', true),
					orderBy('timestamp', 'desc'),
					limit(10),
				);
				//Excute the query
				const querySnap = await getDocs(q);

				let listings = [];

				querySnap.forEach((doc) => {
					return listings.push({
						id: doc.id,
						data: doc.data(),
					});
				});
				//Set Listings
				setListings(listings);
				setLoading(false);
			} catch (error) {
				toast.error('Error fetching listings');
			}
		};
		fetchListings();
	}, []);

	return (
		<div className='category'>
			<header className='pageHeader'>Offers</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<>
					<main>
						<ul className='categoryListings'>
							{listings.map((listing) => (
								<ListingItem
									listing={listing.data}
									id={listing.id}
									key={listing.id}
								/>
							))}
						</ul>
					</main>
				</>
			) : (
				<p>No Current Offers</p>
			)}
		</div>
	);
}

export default Offer;
