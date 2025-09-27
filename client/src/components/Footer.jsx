import { assets, footerLinks } from "../assets/assets";

const Footer = () => {
    
    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-20 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <div className='flex'>
                        <img className="h-8" src={assets.logoPlant} alt="logoPlant" />
                        <img className='h-8' src={assets.blackPlantyIcon} alt="Black Planty Icon" />
                    </div>
                    <p className="max-w-[410px] mt-6">We bring the beauty of nature straight to your doorstep, delivering a variety of plants right to your home. 
                        Whether you're brightening up your living room or starting a garden, we've got you covered with easy ordering, fast delivery
                    </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href={link.url} className="hover:underline transition">{link.text}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © BinatoDrkLight.org All Right Reserved.
            </p>
        </div>
    );
};

export default Footer