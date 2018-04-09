import * as React from 'react'
import Card, { CardActions, CardContent, CardMedia } from 'material-ui/Card'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'

interface StaticCardProps {
  index?: number
  title: string
  className?: string
  children?: React.ReactNode
}

export default (props: StaticCardProps) => (
  <Card className={props.className || ''}>
    <CardContent>
      <Typography variant="headline">{props.title}</Typography>
      {props.children}
    </CardContent>
  </Card>
)
