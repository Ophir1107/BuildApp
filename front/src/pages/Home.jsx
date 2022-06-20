import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { HomeHeader } from '../cmps/HomeHeader'
import appLogo1 from '../assets/img/buildApp_logo.png'
// import productImgUrl from '../assets/img/buildapp-homepage-product.png'
export class Home extends Component {
    render() {
        return (
            <div className="home">
                <HomeHeader />
                <main className="home-container">
                    <div className="logo-container">
                        <section className="logo">
                            <div className="logo-info">
                                <h1>BuildApp</h1>
                                <p>ניהול יעיל, בנייה יעילה</p>
                                {/* <Link to="/workspace" className="clean-link">Get started!</Link> */}
                            </div>
                            <div className="logo-img" >
                                <img src={appLogo1} alt="" style={{background:"center center / cover" }}/>
                            </div>
                            {/* <div className="logo" >
                                <img src={appLogo1} alt="" style={{background:"center center / cover" }}/>
                            </div> */}
                        </section>
                    </div>
                </main>
            </div>
        )
    }
}