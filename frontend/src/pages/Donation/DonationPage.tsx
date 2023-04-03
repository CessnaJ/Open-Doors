import React from 'react';
import Donation from '../../Components/Donation/Donation';
import DonationDesc from '../../Components/Donation/DonationDesc';
import DonationForm from '../../Components/Donation/DonationForm';
// import
// import { DonationDesc } from '../../styles/Donation/Donation';

function DonationPage() {
	return (
		<div>
			<Donation />
			<DonationDesc />
			<DonationForm />
		</div>
	);
}

export default DonationPage;
