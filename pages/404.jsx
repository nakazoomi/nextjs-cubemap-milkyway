import Link from 'next/link';
import Image from 'next/image';

/* Sateless Function Component */

export default function NotFound() {
  return (
    <>
      <div className="error-404__container">
        <div className="error-404__wrapper">
          <Image
            src="/icons/error-404__icon.svg"
            alt="404 error"
            width={100}
            height={100}
            className="error-404__icon"
          />
          <h1>404</h1>

          <h2>Ooops.. this page can not be found.</h2>

          <button id="error-404__btn">
            <Link href="/">
              <a>Back to Homepage</a>
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}
