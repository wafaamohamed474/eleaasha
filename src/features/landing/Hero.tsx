"use client"
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import heroImage from "@/assets/images/heroImg.png"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { AuthDialog } from "@/components/ui/AuthDialog";

export default function Hero() {
    const t = useTranslations("Hero");
    const locale = useLocale();
    const dispatch = useDispatch()
    
    return (
        <section 
            className={cn(
                "pt-25 md:pt-15  lg:py-20 min-h-screen md:min-h-[60vh] lg:min-h-[50vh] xl:min-h-screen flex items-center justify-center",
                "bg-[image:var(--gradient-radial-mobile)]",  
                locale === "ar" 
                    ? "md:bg-[image:var(--gradient-radial-ar)]" 
                    : "md:bg-[image:var(--gradient-radial-en)]"  
            )}
        >
            <div className="container-custom flex items-center flex-col gap-10 md:gap-0 md:flex-row  justify-between text-white">
                 <div className="w-full md:max-w-2/3 text-center md:text-start flex flex-col items-center md:items-start">
                    <h1 className="w-full text-2xl md:text-3xl font-bold md:leading-10  xl:max-w-1/2 ">{t("title")}</h1>
                    <p className="text-sm md:text-md lg:text-xl font-medium md:font-semibold leading-6 md:leading-10 py-5">{t("description")}</p>
                    <AuthDialog 
                     trigger={<Button variant="default"  className="btn-gradient border border-(--border) px-15 py-6 rounded-xl md:text-lg font-bold">{t("startNow")}</Button> }
                     />
                 </div>
                 <motion.div
                    animate={{ translateY: [-10, 10, -10] }}
                    transition={{
                        repeat: Infinity,
                        duration: 6,
                        ease: "easeInOut",
                    }}
                 >
                    <Image src={heroImage} alt="Hero Image" className="w-70 h-70 md:w-50 md:h-50 lg:w-80 lg:h-80 object-contain"/>
                 </motion.div>
            </div>
        </section>
    );
}