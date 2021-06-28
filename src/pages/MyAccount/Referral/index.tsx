import React from 'react'
import { Heading } from '../components'
import { RowBetween, RowFitContent } from '../../../components/Row'
import { ButtonAddLiquidity, CardLiquidity, ResponsiveColumn, TextAddLiquidity } from '../MyLiquidity'
import { Link } from 'react-router-dom'

export default function MyLiquidity() {
  return (
    <ResponsiveColumn>
      <RowBetween>
        <Heading>Referral</Heading>
        <ButtonAddLiquidity as={Link} to="/add/ETH">
          <RowFitContent gap="8px">
            <TextAddLiquidity>Request Reward</TextAddLiquidity>
          </RowFitContent>
        </ButtonAddLiquidity>
      </RowBetween>
      <CardLiquidity>No item to show.</CardLiquidity>
    </ResponsiveColumn>
  )
}
