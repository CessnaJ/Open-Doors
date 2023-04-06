import React, { useCallback, useEffect, useState } from 'react';
import bus from '../../assets/img/bus.png';
import subway from '../../assets/img/subway.png';
import calltaxi from '../../assets/img/calltaxi.png';
import TrafficInfoBody from './TrafficInfoBody';

import {
	TrafficInfoHeader,
	TrafficInfoHeaderContainer,
	LineDiv,
	TaxiCallDiv,
	TrafficTitleWrapper,
	TrafficInfoBox,
	BusArrDiv,
	NoTrafficInfo,
} from '../../styles/Traffic/TrafficStyled';
import axios from 'axios';

const TrafficInfo = () => {
	const [lat, setLat] = useState(0);
	const [lng, setLng] = useState(0);
	const [trafficInfoArr, setTrafficInfoArr] = useState<TrafficInfo[]>([]);
	const [noTrafficInfoMessage, setNoTrafficInfoMessage] = useState<string | null>(null);
	// const [trafficInfoArr, setTrafficInfoArr] = useState<TrafficInfo[]>([]);

	interface ArrInfoProps {
		route_no: number;
		expected_time_min: number;
		bus_stop_position: number;
		destination: string;
	}

	interface TrafficInfo {
		stop_name: string;
		stop_id: number;
		dist: number; //float일수도?
		arr_infos: ArrInfoProps[];
	}

	interface TrafficInfoResponse {
		trafficInfoArr: TrafficInfo[];
	}

	const trafficComponents =
		trafficInfoArr && trafficInfoArr.length > 0 ? (
			trafficInfoArr.map((trafficInfo) => <TrafficInfoBody key={trafficInfo.stop_id} busStop={trafficInfo} />)
		) : lat ? (
			<NoTrafficInfo>{noTrafficInfoMessage}</NoTrafficInfo>
		) : (
			<NoTrafficInfo>위치정보를 받아올 수 없습니다.</NoTrafficInfo>
		);

	// const trafficComponents =
	// 	trafficInfoArr.length > 0 ? (
	// 		trafficInfoArr.map((trafficInfo) => <TrafficInfoBody key={trafficInfo.stop_id} busStop={trafficInfo} />)
	// 	) : lat ? (
	// 		<NoTrafficInfo>주변 교통정보가 없습니다.</NoTrafficInfo>
	// 	) : (
	// 		<NoTrafficInfo>위치정보를 받아올 수 없습니다.</NoTrafficInfo>
	// 	);

	// 장애인콜택시 버튼 클릭
	// function LinkHandler() {
	// 	window.location.href = 'tel:1588-1668';
	// }
	// 😀 모바일에서는 전화. 웹에서는 링크거는 동작
	function LinkHandler() {
		const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

		if (isMobile) {
			window.location.href = 'tel:1588-1668';
		} else {
			window.open('https://www.djcall.or.kr/', '_blank');
		}
	}

	const fetchTrafficInfo = useCallback(() => {
		const accessToken = localStorage.getItem('accessToken');
		const headers = {
			'Content-type': 'application/json',
			// Authorization: `Bearer ${accessToken}`,
		};
		console.log(lat);
		console.log(lng);
		console.log('이제 타입');
		console.log(typeof lat);
		console.log(typeof lat);

		axios
			.get<TrafficInfo[]>(`https://j8b205.p.ssafy.io/api/bus/user/busInfo?userLat=${lat}&userLng=${lng}`)
			.then((res) => {
				console.log('res나온다');
				console.log(res);
				console.log(res.data);
				// const { trafficInfoArr: newTrafficInfoArr } = res.data;
				const newTrafficInfoArr = res.data;
				setTrafficInfoArr(newTrafficInfoArr);
			})
			.catch((err) => {
				console.error(err);
				if (err.response && err.response.status === 500) {
					setNoTrafficInfoMessage('주변 교통정보가 없습니다.');
				} else {
					setNoTrafficInfoMessage('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
				}
			});
	}, [lat, lng]);

	useEffect(() => {
		if (navigator.geolocation) {
			// GeoLocation을 이용해서 접속 위치를 얻어옵니다
			navigator.geolocation.getCurrentPosition(function (position) {
				setLat(position.coords.latitude);
				setLng(position.coords.longitude);
			});
		}
	}, []);

	useEffect(() => {
		if (lat && lng) {
			fetchTrafficInfo();
		}
	}, [lat, lng, fetchTrafficInfo]);

	return (
		<>
			<TrafficInfoHeaderContainer>
				<TrafficInfoHeader>
					<span>주변 </span>
					<em>500m </em>
					<span>교통 정보</span>
				</TrafficInfoHeader>
			</TrafficInfoHeaderContainer>
			<LineDiv />
			<TaxiCallDiv onClick={LinkHandler}>
				<img src={calltaxi} alt="수화기사진" />
				<span>콜택시를 이용한다면?</span>
				<a>장애인 콜택시 예약</a>
			</TaxiCallDiv>
			<LineDiv />
			<TrafficTitleWrapper>
				<span>주변 </span>
				<em>저상버스</em>
				<span>/지하철</span>
			</TrafficTitleWrapper>
			{trafficComponents}
		</>
	);
};

export default TrafficInfo;
