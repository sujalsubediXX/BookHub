import aImage from "../../images/a.jpeg";
import bImage from "../../images/b.jpeg";
import cImage from "../../images/c.webp";
import dImage from "../../images/d.png";
import eImage from "../../images/e.png";
import fImage from "../../images/f.webp";

function About() {
  return (
    <div className="max-w-5xl my-5 mx-auto p-5 bg-[#fff] rounded-lg shadow-md">
      <header className="about-header text-center mb-5">
        <h1 className="text-4xl text-[#333]">Welcome to BookHub</h1>
      </header>
      <section className="about-content">
        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">Our Mission</h2>
        <div className="about-section right flex mt-5">
          <p className="order-1 w-1/2 text-xl text-[#666] leading-[1.6]">
            At BookHub, our mission is to streamline library management and
            provide a user-friendly platform for accessing and organizing
            library resources efficiently. We aim to transform the traditional
            library experience with cutting-edge technology.
          </p>
          <img srcSet={aImage} alt="Mission Image" className="about-image max-h-[60vh] order-2 w-[40%] ml-5 rounded-lg shadow-md" />
        </div>

        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">About BookHub</h2>
        <div className="about-section left flex mt-5 justify-between">
          <img srcSet={bImage} alt="About BookHub" className="about-image order-1 h-[25vh] w-[40%] mr-0 rounded-lg shadow-md" />
          <p className="order-2 w-1/2 text-xl text-[#666] leading-[1.6]">
            BookHub is a comprehensive Library Management System designed to
            cater to the needs of modern libraries. Whether you are managing a
            school library, a public library, or a private collection, BookHub
            offers a range of features to make the process seamless and
            efficient.
          </p>
        </div>

        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">Key Features</h2>
        <div className="about-section right flex mt-5 justify-between">
          <ul className="order-1 w-1/2 list-disc my-5 mx-0 pl-5 text-xl text-[#666] leading-[1.6]">
            <li className="my-[10px] mx-0">
              <strong>Easy Cataloging:</strong> Quickly catalog books and other
              resources with intuitive data entry forms.
            </li>
            <li className="my-[10px] mx-0">
              <strong>Advanced Search:</strong> Find books easily with powerful
              search and filtering options.
            </li>
            <li className="my-[10px] mx-0">
              <strong>User Management:</strong> Manage user profiles, track
              borrowing history, and handle fines.
            </li>
            <li className="my-[10px] mx-0">
              <strong>Inventory Management:</strong> Keep track of book
              inventory, checkouts, and returns.
            </li>
            <li className="my-[10px] mx-0">
              <strong>Reporting:</strong> Generate detailed reports on library
              usage and inventory status.
            </li>
            <li className="my-[10px] mx-0">
              <strong>Notifications:</strong> Send automated notifications for
              due dates, new arrivals, and more.
            </li>
          </ul>
          <img srcSet={cImage} alt="Key Features" className="about-image max-h-[60vh] order-2 w-[44%] ml-5 rounded-lg shadow-md" />
        </div>

        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">Why Choose BookHub?</h2>
        <div className="about-section left flex mt-5 justify-between">
          <img srcSet={fImage} alt="Why Choose Us" className="about-image order-1 h-[25vh] w-[40%] mr-0 rounded-lg shadow-md" />
          <p className="order-2 w-1/2 text-xl text-[#666] leading-[1.6]">
            BookHub stands out for its ease of use, robust features, and
            adaptability to various library needs. Our platform is designed with
            both librarians and users in mind, ensuring a smooth and enjoyable
            experience for everyone involved.
          </p>
        </div>

        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">Our Team</h2>
        <div className="about-section right flex mt-5 justify-between">
          <p className="order-1 w-1/2 text-xl text-[#666] leading-[1.6]">
            Our team comprises experienced developers, librarians, and customer
            service professionals dedicated to providing the best possible
            library management solution. We continuously work on improving
            BookHub based on user feedback and the latest technological
            advancements.
          </p>
          <img srcSet={dImage} alt="Our Team" className="about-image max-h-[60vh] order-2 w-[44%] ml-5 rounded-lg shadow-md" />
        </div>

        <h2 className="text-3xl text-[#555] mt-5 border-b-2 border-solid border-[#ddd] pb-[10px]">Get in Touch</h2>
        <div className="about-section left flex mt-5 justify-between">
          <img srcSet={eImage} alt="Contact Us" className="about-image order-1 h-[25vh] w-[40%] mr-0 rounded-lg shadow-md" />
          <p className="order-2 w-1/2 text-xl text-[#666] leading-[1.6]">
            We'd love to hear from you! Whether you have questions, feedback, or
            need support, feel free to Contact Us.
            Together, let's make library management a breeze with BookHub.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
