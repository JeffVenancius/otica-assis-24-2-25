import { useSearchParams } from 'react-router';
import './Header.css'
import HeaderOptions from './HeaderOptions';
import { useState } from 'react';
import optionsData from '../../data/types.json'
import { Link } from 'react-router';
import { useEffect } from 'react';

const Header = (props) => {
	const [searchParams] = useSearchParams();
	const wppLink = "https://api.whatsapp.com/send/?phone=55"
	const currWpp = searchParams.get("wpp") ? searchParams.get("wpp") : "3598652571"
	const [active, setActive] = useState(null)
	const [mobile, setMobile] = useState(false)

	useEffect(() => {
		if (mobile) {
			document.querySelector("body").style = 'position: fixed'
		} else {
			document.querySelector("body").style = ''
		}
	}, [mobile])

	const changeActive = (e) => {
		if (active === e) setActive(null)
		else setActive(e)
	}

	const changeMobile = () => {
			setMobile(!mobile)
	}

	const isMobile = mobile ? " mobile__on" : ""

	const options = Object.keys(optionsData).map(e => <HeaderOptions changeUrl={props.changeUrl} possibleFilters={props.possibleFilters} currFilters={props.currFilters} setFilters={props.setFilters} type={e} title={window.location.pathname} options={optionsData[e] } key={e + "__options"} changeActive={changeActive} active={active}/>)
	return (
		<div className="header">
			<div className='header__nav'>
				<Link to='./'><img className="header__logo" src={props.headerLogo} alt={props.headerAlt}/></Link>

				<button onClick={changeMobile} className='mobile__hamburger'><img src= {isMobile ? "/assets/burger_close.svg" : "/assets/burger.svg"} alt="Filtrar"></img></button>
				<div className= {'header__nav--menu--mobile' + isMobile}>
						<div className='mobile__background'>
				<button onClick={changeMobile} className='mobile__hamburger'><img src= {isMobile ? "/assets/burger_close.svg" : "/assets/burger.svg"} alt="Filtrar"></img></button>
							<div className='inside__header--mobile'>
								{options}
								<a href={wppLink + currWpp}><button className='header__buttons header__buttons--contact'>Fale conosco</button></a>
						</div>
					</div>
				</div>


				<div className='header__nav--menu'>
					{options}
					<a href={wppLink + currWpp}><button className='header__buttons header__buttons--contact'>Fale conosco</button></a>
				</div>
			</div>
			<div className="header__banner">
				{props.children}
			</div>
			</div>
	)
}

export default Header
