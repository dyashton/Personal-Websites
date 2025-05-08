import Github from "../../assets/Github.png"
import Instagram from "../../assets/instagram.png"
import LinkedIn from "../../assets/LinkedIn.png"
import { useState, useEffect, use } from "react"
import emailjs from "emailjs-com"
import { Form } from "react-router-dom"

export default function Contact() {
    
    const [FormData, setFormData] = useState(
        {
            name: "",
            email: "",
            phone: "",
            company: "",
            message: ""
        }
    );
    
    function handleSubmit(e){
        e.preventDefault();
        console.log("Form Data: ", FormData)
        emailjs.sendForm(import.meta.env.VITE_SERVICE_ID, import.meta.env.VITE_TEMPLATE_ID, e.target, import.meta.env.VITE_PUBLIC_KEY).then(
            (error) => {
                console.log(error.text);
                alert("Failed to send message. Please try again.");
            }
            );
    }

    useEffect(() => {
        console.log("FormData changed: ", FormData);
        if(FormData.name === "" && FormData.phone === "" && FormData.email === "" && FormData.company === "" && FormData.message === ""){
            return;
        }
        localStorage.setItem("FormData", JSON.stringify(FormData));
    },[FormData]);

    useEffect(() => {
        const storedData = localStorage.getItem("FormData");
        if (storedData) {
            setFormData(JSON.parse(storedData));
        }
    }, []);
    
    return (
        <div className="Page">
            <div className="w-full h-full flex flex-row">
                <div className="w-3/4 h-full flex flex-col items-center justify-start">
                <h1 className="text-4xl text-neutral-200 mt-40">Contact Me</h1>
                <form 
                onSubmit={handleSubmit}
                className="w-full h-full flex flex-col items-center justify-start gap-4 mt-20">
                    <div className="flex flex-row gap-10 w-4/5">
                        <input required 
                        name="name"
                        type="text" 
                        placeholder="Name" 
                        value={FormData.name}
                        onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                        <input required 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        value={FormData.email}
                        onChange={(e) => setFormData({ ...FormData, email: e.target.value })}                     
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                    </div>
                    <div className="flex flex-row gap-10 w-4/5">
                        <input required 
                        name="phone"
                        type="text" 
                        placeholder="(123) 456-7890" 
                        value={FormData.phone}
                        onChange={(e) => setFormData({ ...FormData, phone: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                        <input required 
                        name="company"
                        type="text" 
                        placeholder="Company" 
                        value={FormData.company}
                        onChange={(e) => setFormData({ ...FormData, company: e.target.value })}
                        className="outline-none focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 w-full"/>
                    </div>
                    <textarea 
                    required 
                    name="message" 
                    placeholder="Message" 
                    value={FormData.message}
                    onChange={(e) => setFormData({ ...FormData, message: e.target.value })}
                    className="outline-none w-4/5 focus-within:border-neutral-700 bg-none text-neutral-200 border-b-2 p-3 h-30 text-start flex justify-start"/>
                    <div className="w-4/5 text-end mt-10">
                        <button type="submit" className="bg-neutral-600 p-3 rounded-sm cursor-pointer hover:bg-neutral-500">Send</button>
                    </div>
                </form>

                </div>
                <div className="w-1/4 h-full flex flex-col items-center justify-center gap-8">
                    <h1 className="text-2xl mb-8">Find Me</h1>
                    <a target="_blank" href="https://www.instagram.com/_ashtondy/" className="w-1/2 flex flex-row justify-evenly">
                        <img src={Instagram} className="w-15"/>
                        <div className="h-full w-fit flex text-center items-center">_dyashton</div>
                    </a>
                    <a target="_blank" href="https://www.linkedin.com/in/ashton-dy/" className="w-1/2 flex flex-row justify-evenly">
                        <img src={LinkedIn} className="w-15"/>
                        <div className="h-full w-fit flex text-center items-center">Ashton Dy</div>
                    </a>
                    <a target="_blank" href="https://github.com/dyashton"className="w-1/2 flex flex-row justify-evenly">
                        <img src={Github} className="w-15"/>
                        <div className="h-full w-fit flex text-center items-center">dyashton</div>
                    </a>
                </div>
            </div>
        </div>                
    )
}