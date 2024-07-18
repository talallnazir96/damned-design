import Link from "next/link";
import React from "react";
import {
  Col,
  Container,
  Row,
  Breadcrumb,
  BreadcrumbItem,
} from "react-bootstrap";
import Layout from "../components/Layout";
import SeoConfig, { SeoData } from "../components/SEOConfig";
import shippingStyles from "../styles/shipping.module.css";

function PrivacyPolicy() {
  return (
    <Layout>
      <SeoConfig passedSeoData={SeoData.privacyPolicy} />
      <Container className={shippingStyles.container}>
        <div className="mt-3 mb-3">
          <Col className={shippingStyles.breadCol}>
            {/* breadcrumb */}
            <Breadcrumb>
              <BreadcrumbItem>
                <Link href="/">
                  <a className="textDark">Home</a>
                </Link>
              </BreadcrumbItem>
              <BreadcrumbItem active>Privacy Policy</BreadcrumbItem>
            </Breadcrumb>
          </Col>
        </div>
        <PrivacyPolicyContent />
      </Container>
    </Layout>
  );
}

export function PrivacyPolicyContent() {
  return (
    <div>
      <Col className={shippingStyles.shipInfoText}>
        <p>
          <strong>PRIVACY POLICY</strong>
        </p>
        <p>
          <strong> </strong>
        </p>
        <p>
          <strong>Welcome to Damned Designs!</strong>
        </p>
        <p>Damned Designs is owned and operated by Damned Ventures LLC.</p>
        <p>
          Damned Designs values your privacy and the protection of your personal
          data. This privacy policy describes what information we collect from
          you, how we collect it, how we use it, how we obtain your consent, how
          long we keep it in our databases and, if necessary, with whom we share
          it.
        </p>
        <p>
          By visiting the website and purchasing the products, you are accepting
          the practices described in this Privacy Policy. Your use of the
          website and purchase of the products are also subject to our Terms and
          Conditions.
        </p>
        <p>
          This Privacy Policy may change from time to time. Your continued use
          of the website after we make changes is deemed to be acceptance of
          those changes, so please check the policy periodically for updates.
          This Privacy Policy has been prepared and is maintained in accordance
          with all applicable federal and international laws and regulations
          and, specifically, with the GDPR (General Data Protection Regulation
          &#8211; European regulation) and the California Online Privacy
          Protection Act (CalOPPA – U.S regulation).
        </p>
        <p>
          <strong> </strong>
        </p>
        <ol>
          <li>
            <strong>1. GENERAL INFORMATION</strong>
          </li>
        </ol>
        <p>
          The personal data of the users that are collected and processed
          through the website:
        </p>
        <ul>
          <li>
            <Link href="/">
              <a>https://www.damnedventures.com</a>
            </Link>
          </li>
        </ul>
        <p>Will be under responsibility and in charge of:</p>
        <ul>
          <li>
            <strong>Damned Ventures LLC </strong>
            <strong>&#8211; Damned Designs.</strong>
          </li>
          <li>
            <strong>
              Adrian Dsouza.{" "}
              <a href="mailto:Info@damneddesigns.com">info@damneddesigns.com</a>
              . +1 3376029228
            </strong>
          </li>
        </ul>
        <p>(Hereinafter referred to as “Damned Designs”).</p>
        <p>
          <strong> </strong>
        </p>
        <ol start="2">
          <li>
            <strong>2. TYPES OF INFORMATION GATHERED</strong>
          </li>
        </ol>
        <p>
          The information we collect from our users and customers helps us to
          provide our products effectively and to personalize and continually
          improve the user experience on the website. These are the types of
          information we collect:
        </p>
        <p>
          <strong>Information You Give Us. </strong>You provide information when
          you search, read and view content, purchase products and/or
          communicate with us through our contact information or through our
          contact forms. As a result of those actions, you might supply us with
          the following information:
        </p>
        <ul>
          <li>First and last name</li>
          <li>Email address</li>
          <li>Phone number (includes WhatsApp number)</li>
          <li>Address (shipping purposes)</li>
          <li>IP address</li>
          <li>Payment Information</li>
          <li>
            Any additional information relating to you that you provide to us
            directly through our website or indirectly through our website or
            online presence such as ‘cookies’.
          </li>
        </ul>
        <p>
          Damned Designs will not collect any personally identifiable
          information about you, unless you provide it.
        </p>
        <p>
          <strong>Information Collected Automatically:</strong> By accessing and
          using the website you automatically provide us with the following
          information:
        </p>
        <ul>
          <li>
            The device and usage information you use to access the website
          </li>
          <li>Your IP address</li>
          <li>Browser and device characteristics</li>
          <li>Operating system</li>
          <li>Referring URLs</li>
          <li>Your location</li>
          <li>What parts of the website you use and how often</li>
        </ul>
        <p>
          If you access the website through a mobile phone, we will collect the
          following information:
        </p>
        <ul>
          <li>Mobile device ID</li>
          <li>Model and manufacturer</li>
          <li>Operating system</li>
          <li>Version information</li>
          <li>IP address</li>
        </ul>
        <p>
          <strong>Payment information:</strong> Your credit/debit card
          information or payment information will be processed by PayPal and
          Sezzle (payment platforms available on the website), which will treat
          and safeguard your data with total security and with the exclusive
          purpose of processing the purchase of the products. Damned Designs
          reserves the right to contract any payment platform available in the
          market, which treats your data for the exclusive purpose of processing
          the purchase of the products.
        </p>
        <p>See the privacy policy of PayPal and Sezzle here:</p>
        <ul>
          <li>
            <a href="https://www.paypal.com/us/webapps/mpp/ua/privacy-full">
              https://www.paypal.com/us/webapps/mpp/ua/privacy-full
            </a>
          </li>
          <li>
            <a href="https://legal.sezzle.com/privacy">
              https://legal.sezzle.com/privacy
            </a>
          </li>
        </ul>
        <p>
          <strong>GOOGLE Analytics. </strong>We use Google Analytics provided by
          Google, Inc., USA (“Google”). These tool and technologies collect and
          analyze certain types of information, including IP addresses, device
          and software identifiers, referring and exit URLs, feature use metrics
          and statistics, usage and purchase history, media access control
          address (MAC Address), mobile unique device identifiers, and other
          similar information via the use of cookies. The information generated
          by Google Analytics (including your IP address) may be transmitted to
          and stored by Google on servers in the United States. We use the
          GOOGLE Analytics collection of data to enhance the website and improve
          our service.
        </p>
        <p>Please consult Google&#8217;s privacy policy here:</p>
        <ul>
          <li>
            <a href="https://policies.google.com/privacy">
              https://policies.google.com/privacy
            </a>
          </li>
        </ul>
        <p>
          <strong>Facebook Pixel: </strong>Our website uses the Facebook Pixel.
          Through the Facebook Pixel we can collect user information for
          different purposes. We use the Facebook Pixel for the following
          purposes:
        </p>
        <ul>
          <li>
            Collect statistics about our website (for example, the number of
            users who visited a page).
          </li>
          <li>
            Collect information about how you interact with our website (for
            example, whether you opened or followed links contained in them).
          </li>
          <li>Personalize online services and marketing communications.</li>
          <li>
            Tailor advertisements to users and optimize advertising campaigns.
          </li>
        </ul>
        <p>
          The information collected through the Facebook Pixel will be collected
          and stored by Facebook and will be treated in accordance with its
          privacy policy. The information we collect through the Facebook Pixel
          does not personally identify the user and will never be used for
          purposes other than those contained in this privacy policy and
          Facebook&#8217;s privacy policy.
        </p>
        <p>Please consult Facebook&#8217;s privacy policy here:</p>
        <ul>
          <li>
            <a href="https://www.facebook.com/privacy/explanation">
              https://www.facebook.com/privacy/explanation
            </a>
          </li>
        </ul>
        <p>
          <strong>Automatic Information.</strong> Like many websites, we use
          &#8220;cookies.&#8221; We obtain certain types of anonymous
          information which is not personally identifiable when your web browser
          accesses, Damned Designs or third-party content served by or on behalf
          of Damned Designs on other websites. Some of the information we
          collect and analyze includes the Internet protocol (IP) address;
          computer and connection information such as browser type, version, and
          connection speed; purchase history; and the products you searched for,
          viewed, and possibly purchased.
        </p>
        <p>
          <strong>Social Media</strong>: On our website you will find links and
          functions linked to different social networks, in which you can share
          your information.
        </p>
        <p>
          It is advisable to consult the privacy policy and data protection of
          each social network used on our website.
        </p>
        <ul>
          <li>
            Facebook:{" "}
            <a href="https://www.facebook.com/privacy/explanation">
              https://www.facebook.com/privacy/explanation
            </a>
          </li>
          <li>
            Instagram:{" "}
            <a href="http://instagram.com/about/legal/privacy/">
              http://instagram.com/about/legal/privacy/
            </a>
          </li>
        </ul>
        <ol start="3">
          <li>
            <strong>3. HOW LONG WE KEEP YOUR DATA</strong>
          </li>
        </ol>
        <p>
          Personal data provided by users and customers through the website will
          be kept for the time necessary for the provision of products. Damned
          Designs may be allowed to retain personal data for a longer period
          whenever the user has given consent to such processing, as long as
          such consent is not withdrawn. Furthermore, Damned Designs may be
          obliged to retain personal data for a longer period whenever required
          to do so for the performance of a legal obligation or upon order of an
          authority. Once the retention period expires, personal data shall be
          deleted. Therefore, the right to access, the right to erasure, the
          right to rectification and the right to data portability cannot be
          enforced after expiration of the retention period.
        </p>
        <ol start="4">
          <li>
            <strong>4. HOW WE USE YOUR INFORMATION. </strong>
          </li>
        </ol>
        <p>
          In general, we use the information we collect primarily to provide,
          maintain, protect and improve our current website and products. We use
          personal information collected through our site as described below and
          described elsewhere in this Policy to:
        </p>
        <ul>
          <li>Identify you as a user in our system.</li>
          <li>User registration.</li>
          <li>Process payments.</li>
          <li>Deliver the products.</li>
          <li>Manage returns and refunds.</li>
          <li>
            Improve our products, website, and how we operate our business.
          </li>
          <li>
            Understand and enhance your experience using our website and
            products.
          </li>
          <li>
            Respond to your comments or questions through our support team.
          </li>
          <li>
            Send you related information, including confirmations, invoices,
            technical notices, updates, security alerts and support and
            administrative messages.
          </li>
          <li>
            Communicate with you about upcoming events, offers and news about
            products and services offered by Damned Designs and our selected
            partners.
          </li>
          <li>Marketing purposes of Damned Designs.</li>
          <li>
            Link or combine your information with other information we get from
            third parties to help understand your needs and provide you with
            better service.
          </li>
          <li>
            Protect, investigate and deter against fraudulent, unauthorized or
            illegal activity.
          </li>
        </ul>
        <ol start="5">
          <li>
            <strong>5. HOW DO YOU GET MY CONSENT?</strong>
          </li>
        </ol>
        <p>
          By placing an order, communicating with us through the contact forms
          or our contact information, accepting the use of cookies by our
          website and providing us with personal information to communicate with
          you, you consent to our collection, storage and use of your
          information on the terms contained in this privacy policy. You consent
          to the use of cookies on our website when you give your acceptance
          through the pop-up window shown on the home page when you enter the
          website. You may withdraw your consent by sending us your request via
          the contact information or the contact page.
        </p>
        <ol start="6">
          <li>
            <strong>6. HOW WE SHARE INFORMATION</strong>
          </li>
        </ol>
        <p>
          The personal information of our customers and users is an important
          and fundamental part of our business. Under no circumstances will we
          sell or share information with third parties that has not been
          previously authorized by the user, customer or owner of the personal
          data. We share user and customer information only and exclusively as
          described below.
        </p>
        <p>
          <strong>Third-Party Service Providers.</strong> We use the services of
          third parties to perform certain functions on our behalf and through
          our website and services. Examples include processing payments
          (PayPal, Sezzle), building and hosting the website, delivering
          products (shipping companies), sending emails, analyzing data (Google
          Analytics), creating ads (Facebook, Google), providing marketing
          assistance, and delivering search results and links.
        </p>
        <p>
          These third-party services and tools may have access to personal
          information needed to perform their functions, but may not use that
          information for other purposes. Information shared with these
          third-party services will be treated and stored in accordance with
          their respective privacy policies and our privacy policy.
        </p>
        <p>
          <strong>Business Transfers</strong>. In the event that Damned Designs
          creates, merges with, or is acquired by another entity, your
          information will most likely be transferred. Damned Designs will email
          you or place a prominent notice on our website before your information
          becomes subject to another privacy policy.
        </p>
        <p>
          <strong>Protection of </strong>
          <strong>Damned Designs </strong>
          <strong>and others</strong>. We release personal information when we
          believe release is appropriate to comply with the law, enforce or
          apply our Terms and conditions and other agreements, or protect the
          rights, property, or safety of Damned Designs, our users or others.
          This includes exchanging information with other companies and
          organizations for fraud protection and credit risk reduction.
        </p>
        <p>
          <strong>With Your Consent</strong>. Other than as set out above, you
          will receive notice when personally identifiable information about you
          might go to third parties, and you will have an opportunity to choose
          not to share the information.
        </p>
        <p>
          <strong>Anonymous Information.</strong>
          <strong> </strong>Damned Designs uses the anonymous browsing
          information collected automatically by our servers primarily to help
          us administer and improve the website. We may also use aggregated
          anonymous information to provide information about the website to
          potential business partners and other unaffiliated entities. This
          information is not personally identifiable.
        </p>
        <p>
          <strong>Email Address</strong>. The email address that you supply to
          us for purposes of receiving our email communications will never be
          rented or sold to a third party.
        </p>
        <ol start="7">
          <li>
            <strong>7. PROTECTING YOUR INFORMATION</strong>
          </li>
        </ol>
        <p>
          We work to protect the security of your information during
          transmission by using Secure Sockets Layer (SSL) software, which
          encrypts information you input. If transactions are processed on the
          website, transaction information is transmitted to and from the
          website in encrypted form using industry-standard SSL connections to
          help protect such information from interception. We restrict
          authorized access to your personal information to those persons who
          have a legitimate purpose to know that information to provide products
          or services to you and those persons you have authorized to have
          access to such information.
        </p>
        <p>
          Damned Designs follows generally accepted industry standards to
          protect the personal information submitted to us, both during
          transmission and once Damned Designs receives it. No method of
          transmission over the Internet, or method of electronic storage, is
          100% secure. Therefore, while Damned Designs strives to use
          commercially acceptable means to protect your personal information, we
          cannot guarantee its absolute security.
        </p>
        <p>
          We will not sell, distribute, or lease your personal information to
          third parties unless we have your permission or are required by law to
          do so.
        </p>
        <p>
          <strong> </strong>
        </p>
        <ol start="8">
          <li>
            <strong>8. RIGHTS </strong>
          </li>
        </ol>
        <p>
          Users who provide information through our website, as data subjects
          and data owners, have the right to access, rectify, download or delete
          their information, as well as to restrict and object to certain
          processing of their information. While some of these rights apply
          generally, others apply only in certain limited circumstances. We
          describe these rights below:
        </p>
        <ul>
          <li>
            <strong>Access and portability:</strong> to access and know what
            information is stored in our servers, you can send us your request
            through our contact information.
          </li>
          <li>
            <strong>Rectify, Restrict, Limit, Delete</strong>: You can also
            rectify, restrict, limit or delete much of your information.
          </li>
          <li>
            <strong>Right to be informed:</strong> Users of our website will be
            informed, upon request, about what data we collect, how it is used,
            how long it is retained and whether it is shared with third parties.
          </li>
          <li>
            <strong>Object:</strong> When we process your information based on
            our legitimate interests as explained above, or in the public
            interest, you may object to this processing in certain
            circumstances. In such cases, we will stop processing your
            information unless we have compelling legitimate reasons to continue
            processing it or where it is necessary for legal reasons.
          </li>
          <li>
            <strong>Revoke consent:</strong> Where you have previously given
            your consent, such as to allow us to process and store your personal
            information, you have the right to revoke your consent to the
            processing and storage of your information at any time. For example,
            you may withdraw your consent by updating your settings. In certain
            cases, we may continue to process your information after you have
            withdrawn your consent if we have a legal basis for doing so or if
            your withdrawal of consent was limited to certain processing
            activities.
          </li>
          <li>
            <strong>Complaint:</strong> If you wish to file a complaint about
            our use of your information (and without prejudice to any other
            rights you may have), you have the right to do so with your local
            supervisory authority. Users can exercise all these rights by
            contacting us through the contact information or the contact page.
          </li>
          <li>
            <strong>
              Rights related to automated decision-making, including profiling:
            </strong>{" "}
            website users may request that we provide a copy of the automated
            processing activities we conduct if they believe that data is being
            unlawfully processed.
          </li>
        </ul>
        <p>
          Users or owners of the personal information they provide through the
          website may exercise these rights over their personal information at
          any time and without any limitation by sending us their request
          through our contact information.
        </p>
        <p>
          <strong> </strong>
        </p>
        <ol start="9">
          <li>
            <strong>9. CHILDREN’S ONLINE PRIVACY PROTECTION </strong>
          </li>
        </ol>
        <p>
          We are in compliance with the requirements of the GDPR (General Data
          Protection Regulation &#8211; European regulation) and the California
          Online Privacy Protection Act (CalOPPA – U.S regulation), regarding
          the protection of the personal data of minors. Although the website
          and products are available to all ages, we do not collect any
          information from children under the age of 13 without the respective
          permission of their parents or legal guardians. If you become aware
          that a child under the age of 13 has provided us with personal
          information without the permission of a parent or legal guardian,
          please contact us. If we become aware that a minor has provided us
          with personal information without parental or legal guardian
          permission, we will take steps to delete that information, terminate
          that person&#8217;s account, and restrict access to that
          person&#8217;s account.
        </p>
        <p>
          <strong> </strong>
        </p>
        <ol start="10">
          <li>
            <strong>10. EDITING AND DELETING INFORMATION</strong>
          </li>
        </ol>
        <p>
          If you believe that any information, we are holding on you is
          incorrect or incomplete, please write to or email us as soon as
          possible. We will promptly correct any information found to be
          incorrect. You can change, modify, rectify and delete your Information
          at any time, please contact us through the contact information. To
          opt-out of Damned Designs email, follow the instructions included in
          the email. Your request should be processed within 48 hours.
        </p>
        <ol start="11">
          <li>
            <strong>11. THIRD PARTIES</strong>
          </li>
        </ol>
        <p>
          Except as otherwise expressly included in this Privacy Policy, this
          document addresses only the use and disclosure of information Damned
          Designs collects from you. If you disclose your information to others,
          whether other users or suppliers on Damned Designs, different rules
          may apply to their use or disclosure of the information you disclose
          to them. Damned Designs does not control the privacy policies of third
          parties, and you are subject to the privacy policies of those third
          parties where applicable. Damned Designs is not responsible for the
          privacy or security practices of other websites on the Internet, even
          those linked to or from the Damned Designs site. Damned Designs
          encourages you to ask questions before you disclose your personal
          information to others.
        </p>
        <ol start="12">
          <li>
            <strong>12. CONTACT US </strong>
          </li>
        </ol>
        <p>
          If you have questions or concerns about these Privacy Policy and the
          handling and security of your data, please contact us through our
          contact page or via the contact information below:
        </p>
        <p>
          <strong>Damned Ventures LLC &#8211; Damned Designs.</strong>
        </p>
        <p>
          <strong>
            Adrian D’souza.{" "}
            <a href="mailto:info@damneddesigns.com">info@damneddesigns.com</a>.
            +1 3376029228
          </strong>
        </p>
        <p>
          <strong> </strong>
        </p>
      </Col>
    </div>
  );
}

export default PrivacyPolicy;
