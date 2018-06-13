import * as React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const styles = require('./styles')

interface StaticCardProps {
  index?: number
  title: string
  page?: string
  className?: string
  children?: React.ReactNode
}

export default (props: StaticCardProps) => (
  <Card className={props.className || ''}>
    <CardContent
      classes={{
        root: styles.cardContentRoot
      }}
    >
      <Typography
        variant="headline"
        align="justify"
        classes={{ root: styles.titleRoot }}
      >
        {props.title}{' '}
        {props.page ? (
          <a href={`/#/${props.page}`} className={styles.page}>
            查看全部
          </a>
        ) : null}
      </Typography>
      {props.children}
    </CardContent>
  </Card>
)
