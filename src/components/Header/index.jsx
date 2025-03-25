import { useSearchParams } from 'react-router';
import './Header.css'
import HeaderOptions from './HeaderOptions';
import NewHeaderOptions from './NewHeaderOptions';
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
	const [started, setStarted] = useState(false)

	useEffect(()=> setStarted(true))
	useEffect(() => {
		if (mobile) {
			document.querySelector("body").style = 'position: fixed'
		} else if (started){
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

	let hasItems = {}
	hasItems['Óculos de Grau'] = props.totalItems.totalItems.filter(e => e['Grau/Sol'] == 'Óculos de Grau')
	hasItems['Óculos de Sol'] = props.totalItems.totalItems.filter(e => e['Grau/Sol'] == 'Óculos de Sol')
	optionsData['Marcas'].forEach(e => {
		hasItems[e] = props.totalItems.totalItems.filter(f => {
			return f['marca'] === e})
	})

	optionsData['Formato'].forEach(e => {
		hasItems[e] = props.totalItems.totalItems.filter(f => {
			return f['Formato'] === e})
	})

	const uniq = (arr,type) => {
	let already = []
	for (let i = 0; i < arr.length; i++) {
		let e = arr[i]
		if (!already.includes(e) && e !== undefined) {
			already.push(e)
		}
		if (optionsData[type].length === already.length) return already
	}
		return already
}

	let newOptions = {}
	newOptions['Óculos de Grau'] = uniq(hasItems['Óculos de Grau'].map(e => e['Formato']),'Formato')
	newOptions['Óculos de Sol'] = uniq(hasItems['Óculos de Sol'].map(e => e['Formato']),'Formato')

	newOptions['Marca'] = {}
	optionsData['Marcas'].forEach(e => {
		newOptions['Marca'][e] = {}
		newOptions['Marca'][e]['Óculos de Grau'] = {}
		let filtered = {}
		filtered['Óculos de Grau'] = hasItems[e].filter(f => f['Grau/Sol'] === 'Óculos de Grau')
		filtered['Óculos de Sol'] = hasItems[e].filter(f => f['Grau/Sol'] === 'Óculos de Sol')
		newOptions['Marca'][e]['Óculos de Grau'] = uniq(filtered['Óculos de Grau'].map(f => f['Formato']),'Formato')
		newOptions['Marca'][e]['Óculos de Sol'] = uniq(filtered['Óculos de Sol'].map(f => f['Formato']),'Formato')
	})



const order = ['Marca', 'Oculos de Grau', 'Óculos de Sol']


// const options = Object.keys(optionsData).map(e => <HeaderOptions possibleFilters={props.possibleFilters} currFilters={props.currFilters} setFilters={props.setFilters} type={e} title={window.location.pathname} options={optionsData[e] } key={e + "__options"} changeActive={changeActive} active={active}/>)
return (
	<div className="header">
	<div className='header__nav'>
	<Link reloadDocument to='/'><img className="header__logo" src={props.headerLogo} alt={props.headerAlt}/></Link>

	<button onClick={changeMobile} className={'mobile__hamburger ' + (mobile ? "hambuger__outside" : "") }><img src= "/assets/burger.svg" alt="Filtrar"></img></button>
	<div className= {'header__nav--menu--mobile' + isMobile}>
	<div className='mobile__background'>
	<div className='inside__header--mobile'>
	<button onClick={changeMobile} className={'mobile__hamburger ' + (mobile ? "hambuger__close" : "hambuger__inside") }><img src= "/assets/burger.svg" alt="Filtrar"></img></button>
	<div className='Category--first'>
	</div>
	<HeaderOptions/>
	<a href={wppLink + currWpp} className='header__fale--conosco'><button className='header__buttons header__buttons--contact'>Fale conosco</button></a>
	</div>
	</div>
	</div>


	<div className='header__nav--menu'>
	<HeaderOptions/>
	<a href={wppLink + currWpp} className="header__fale--conosco"><button className='header__buttons header__buttons--contact'>Fale conosco</button></a>
	</div>
	</div>
	<div className="header__banner">
	{props.children}
	</div>
	</div>
)
}

export default Header
