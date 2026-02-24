import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import TrendingProduct from '../components/TrendingProduct'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
        <MainBanner/>
        <Categories/>
        <TrendingProduct/>
        <BottomBanner/>
        <NewsLetter/>
    </div>
  )
}

export default Home