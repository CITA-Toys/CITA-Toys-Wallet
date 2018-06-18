import * as React from 'react'
import { createPortal } from 'react-dom'

const layout = require('../../styles/layout.scss')
const styles = require('./styles.scss')

interface Product {
  logo: string
  title: string
  url: string
  overview: string
}
interface Contact {
  icon: any
  title: string
  url: string
}

class Footer extends React.Component {
  state = {
    overview: {
      title: 'Overview',
      content:
        'Microscope is a blockchain explorer.\n Microscope is a blockchain explorer.',
    },
    products: {
      title: '其他产品',
      items: [
        {
          logo:
            'http://nervos.org/images/logo-fd71390dd58d38f3ea30de42ab713791.png',
          title: 'Nervos AppChain',
          url: 'http://nervos.org/',
          overview: 'Nervos AppChain',
        },
        {
          logo:
            'https://raw.githubusercontent.com/cryptape/assets/master/CITA-logo.png',
          title: 'CITA',
          url: 'https://github.com/cryptape/cita',
          overview: 'CITA',
        },
      ] as Product[],
    },
    contacts: {
      title: '联系我们',
      items: [
        {
          icon: 'email',
          title: 'E-mail',
          url: 'contact@cryptape.com',
        },
        {
          icon: 'group',
          title: 'Nervos-AppChain 开发者群组',
          url: 'https://t.me/joinchat/GkxnS1L8xTx_c1InzeC0Cw',
        },
        // {
        //   icon: 'telegram',
        //   title: 'Telegram',
        //   url: '..',
        // },
      ] as Contact[],
    },
  }
  render () {
    const { overview, products, contacts } = this.state
    return (
      <div className={`${styles.footer} ${layout.center}`}>
        <div className={styles.overview}>
          <h1>{overview.title}</h1>
          <p>{overview.content}</p>
        </div>
        <div className={styles.products}>
          <h1>{products.title}</h1>
          <div>
            {products.items.map(item => (
              <div key={item.title}>
                <a href={item.url} rel="noreferrer noopener" target="_blank">
                  <img src={item.logo} alt={item.title} />
                </a>
                <p>{item.overview}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.contacts}>
          <h1>{contacts.title}</h1>
          {contacts.items.map(item => (
            <a
              key={item.title}
              href={item.url}
              rel="noreferrer noopener"
              target="_blank"
            >
              <svg className="icon" aria-hidden="true">
                <use xlinkHref={`#icon-${item.icon}`} />
              </svg>
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </div>
    )
  }
}

export default () =>
  createPortal(<Footer />, document.getElementById('footer') as HTMLElement)
