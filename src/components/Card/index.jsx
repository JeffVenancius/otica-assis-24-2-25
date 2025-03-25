import { useEffect, useState } from "react"
import './Card.css'
import WppBtn from '../WppButton'
import { Link } from "react-router-dom"

import colors from '../../data/colors.json'

const ImgCarousel = (props) => {
	if (props.imgs) {
		if (props.imgs.length > 1) {
			return (
				<Link to={props.url}> 
					<div className="card__img__colection">
						{props.imgs.map(e => <img style={{translate: `${-100 * props.currImg}%`}} alt={props.modelo} className="card__image__custom" src={e} loading="lazy" key={e}/>)}
					</div>
				</Link>
			)
		} else {
			return <Link to={props.url}> <img alt={props.modelo} className="card__image__custom" src={props.imgs[0]} loading="lazy"/> </Link>
		}
	}
}
const ImgContainer = (props) => {
	if (props.tipoDeCard === "Com Preço Promocional") {
		return (
		<div className="promoContainer">
			<ImgCarousel 
				url={props.url}
				tipoDeCard={props.tipoDeCard} 
				img={props?.imgs} 
				currImg={props.currImg} 
				discount={props.discount}
				marca={props.marca}
				modelo={props.modelo}
				wppDesc={props.wppDesc}
			/>
		</div>
		)
	}
	return (
		<ImgCarousel
				url={props.url}
				tipoDeCard={props.tipoDeCard} 
				imgs={props?.imgs} 
				currImg={props.currImg} 
				discount={props.discount}
				marca={props.marca}
				modelo={props.modelo}
				wppDesc={props.wppDesc}
		/>
	)
}



const Card = (props) => {
	const [currImg, setCurrImg] = useState(0)
	const [currVar, setCurrVar] = useState(0)
	const [vars, setVars] = useState([props.values])

	const modelo_curr = "modelo" in vars[currVar] ? vars[currVar].modelo : ""
	const marca_curr = "marca" in vars[currVar] ? vars[currVar].marca : ""
	const corN_curr = "cor numérica" in vars[currVar] ? vars[currVar]['cor numérica'] : ""
	const wppDesc_curr = "wppDesc" in vars[currVar]? vars[currVar].wppDesc : ""
	const imgs_curr = vars[currVar].imgs
	const tipoDeCard_curr = vars[currVar].tipoDeCard
	const preco_curr = vars[currVar].preco
	const precoPromo_curr = vars[currVar].precoPromo
	const cor_curr = "cor" in vars[currVar] ? vars[currVar].cor : ""

	const url = [marca_curr, modelo_curr, corN_curr, wppDesc_curr, cor_curr].filter(e => e !== "").join("--")
	useEffect(() => {
		if ("variações" in props.values) {
			setVars([...vars, ...props.values['variações']])
		}
	},[])

const changeProductVar = (index) => {
	setCurrVar(index)
}


	let wppMsg = encodeURI("Olá! Gostei muito desse!\n " + window.location.hostname + "/produto/" + url.replace('/',''))

	useEffect(() => {
		if (!imgs_curr) {
			return
		}
		if (imgs_curr.length === 1) return
		const timedOut = setTimeout(() => {setCurrImg(currImg === imgs_curr.length - 1 ? 0 : currImg + 1)}, 4000)
		return () => clearTimeout(timedOut)
	},[currImg])


	if (tipoDeCard_curr === "Com Preço" || tipoDeCard_curr === "Com Preço Promocional") {
		let formater = new Intl.NumberFormat('pt-BR', {
			style: "currency",
			currency: "BRL",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})
		let times = 1
		while (preco_curr/times > 60 && times < 12) { // 60 é o valor minimo da parcela
			times++
		}
		let precoFormatado = formater.format(preco_curr/times)
		let price_option1 = times === 1 ? precoFormatado + " à vista" : times + "x de " + precoFormatado + " sem juros"
		let price_option2 =  times === 1 ? "" : "ou " + formater.format(preco_curr) + " à vista"
	return (
		<div className="card__custom">
			<ImgContainer url={"/produto/" + url.replace('/','')} marca={marca_curr} modelo={modelo_curr} wppDesc={wppDesc_curr} tipoDeCard={tipoDeCard_curr} imgs={imgs_curr} currImg={currImg} discount={100 - (precoPromo_curr/preco_curr) * 100}/>
			<div className="card--description">
		<div className="card__variations">{vars.length > 1 && vars.map((e,i) => {
			return <button key={e.cor + e.marca + e.modelo + e.corN + i} className={"card__variations__btn " + (i === currVar ? "active" : "")} style={{backgroundImage: "url('"+ colors[e.cor] + "')"}} onClick={() => changeProductVar(i)}></button>
		})}</div>
	  			<div className="card__description-model">
				<h2 >{marca_curr}</h2>
				<h2>{modelo_curr}</h2>
	  			</div>
				<div className="card__description_price_container">
					<h3 className="card--description--price"> <span className="compare"></span>{price_option1}</h3>
					<p className="card--description--price"> {price_option2}</p>
				</div>
				<WppBtn
					mensagem={wppMsg}
					texto="Eu quero!"
				/>
			</div>
    </div>
  );
	}
	return (
		<div className="card__custom">
			<ImgContainer url={"/produto/" + url.replace('/','')} tipoDeCard={tipoDeCard_curr} marca={marca_curr} modelo={modelo_curr} wppDesc={wppDesc_curr} imgs={imgs_curr} currImg={currImg} discount={(100 - (precoPromo_curr/preco_curr) * 100)}/>
			<div className="card--description">
			<div className="card__variations">{vars.length > 1 && vars.map((e,i) => {
				return <button key={e.cor + e.marca + e.modelo + e.corN} className={"card__variations__btn " + (i === currVar ? "active" : "")} style={{backgroundImage: "url('"+ colors[e.cor] + "')"}} onClick={() => changeProductVar(i)}></button>
		})}</div>
	  			<div className="card__description-model">
				<h2 >{marca_curr}</h2>
				<h2>{modelo_curr}</h2>
	  			</div>
				<WppBtn
					mensagem={wppMsg}
					texto="Eu quero!"
				/>
			</div>
    </div>
  );
}

export default Card
