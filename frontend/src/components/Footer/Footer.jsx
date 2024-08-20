import React from 'react'
import { assets } from '../../assets/assets'
import './Footer.css'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
          <div className="footer-content">
            <div className='footer-content-left'>
                <img src={assets.logoblack} alt="" />
                <p>
                "At Tumunch, we’re passionate about delivering fresh and delicious meals straight to your door. Our mission is to make your dining experience convenient and delightful, whether you're at home or on the go. Enjoy the taste of quality, one bite at a time."


                </p>
             <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
             </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li>+1-226-975-2322</li>
                    <li>erictumu@outlook.com</li>
                </ul>
            </div>
          </div>
          <hr />
          <p className='footer-copyright'>Copyright 2024 @ <span>Tumunch</span>.com - All Rights Reserved.</p>
    </div>
  )
}

export default Footer