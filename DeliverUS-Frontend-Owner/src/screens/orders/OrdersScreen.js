/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, ImageBackground, Image, Pressable } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { getDetail, getRestaurantAnalytics, getRestaurantOrders } from '../../api/RestaurantEndpoints'
import { nextStatus } from '../../api/OrderEndpoints'

import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { API_BASE_URL } from '@env'

export default function OrdersScreen ({ navigation, route }) {
  const [orders, setOrders] = useState({})
  const [restaurant, setRestaurant] = useState({})
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchRestaurantDetail()
    fetchRestaurantAnalytics()
    fetchRestaurantOrders()
  }, [route])

  const fetchRestaurantAnalytics = async () => {
    try {
      const fetchedAnalytics = await getRestaurantAnalytics(route.params.id)
      setAnalytics(fetchedAnalytics)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant analytics (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }
  const fetchRestaurantOrders = async () => {
    try {
      const fetchedOrders = await getRestaurantOrders(route.params.id)
      setOrders(fetchedOrders)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant orders (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const handleNextStatus = async (order) => {
    try {
      await nextStatus(order)
      showMessage({
        message: `Order ${order.id} status updated`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      fetchRestaurantOrders()
      fetchRestaurantAnalytics()
    } catch (error) {
      showMessage({
        message: `Error advancing order status. ${error}`,
        type: 'danger',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const renderAnalytics = () => {
    return (
      <View style={styles.analyticsContainer}>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCell}>
              <TextRegular textStyle={styles.text}>
                Invoiced today
              </TextRegular>
              <TextSemiBold textStyle={styles.text}>
              {analytics.invoicedToday.toFixed(2)}€
              </TextSemiBold>
            </View>
            <View style={styles.analyticsCell}>
              <TextRegular textStyle={styles.text}>
                #Pending orders
              </TextRegular>
              <TextSemiBold textStyle={styles.text}>
              {analytics.numPendingOrders}
              </TextSemiBold>
            </View>

          </View>
          <View style={styles.analyticsRow}>
            <View style={styles.analyticsCell}>
                <TextRegular textStyle={styles.text}>
                  #Delivered today
                </TextRegular>
                <TextSemiBold textStyle={styles.text}>
                  {analytics.numDeliveredTodayOrders}
                </TextSemiBold>
              </View>
              <View style={styles.analyticsCell}>
                <TextRegular textStyle={styles.text}>
                  #Yesterday orders
                </TextRegular>
                <TextSemiBold textStyle={styles.text}>
                  {analytics.numYesterdayOrders}
                </TextSemiBold>
              </View>
          </View>
        </View>
    )
  }
  const renderHeader = () => {
    return (
      <View>
        <ImageBackground source={(restaurant?.heroImage) ? { uri: API_BASE_URL + '/' + restaurant.heroImage, cache: 'force-cache' } : undefined} style={styles.imageBackground}>
          <View style={styles.restaurantHeaderContainer}>
            <TextSemiBold textStyle={styles.textTitle}>{restaurant.name}</TextSemiBold>
            <Image style={styles.image} source={restaurant.logo ? { uri: API_BASE_URL + '/' + restaurant.logo, cache: 'force-cache' } : undefined} />
            <TextRegular textStyle={styles.description}>{restaurant.description}</TextRegular>
            <TextRegular textStyle={styles.description}>{restaurant.restaurantCategory ? restaurant.restaurantCategory.name : ''}</TextRegular>
          </View>
        </ImageBackground>
        { analytics !== null && renderAnalytics() }
      </View>
    )
  }

  const getOrderStyle = (status) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: GlobalStyles.brandSecondary }
      case 'in process':
        return { backgroundColor: GlobalStyles.brandBlue }
      case 'sent':
        return { backgroundColor: GlobalStyles.brandBlueTap }
      case 'delivered':
        return { backgroundColor: GlobalStyles.brandGreen }
      default:
        return { backgroundColor: GlobalStyles.brandSecondary }
    }
  }

  const renderOrder = ({ item }) => {
    return (
      <View style={[styles.row, getOrderStyle(item.status)]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <TextRegular numberOfLines={2}>{item.status}</TextRegular>
          <TextRegular numberOfLines={2}>{item.address}</TextRegular>
          <TextRegular numberOfLines={2}>{item.price}€</TextRegular>
        </View>
        <Pressable
          style={styles.editButton}
          onPress={() => navigation.navigate('EditOrderScreen', { orderId: item.id })}
        >
          <MaterialCommunityIcons name="pencil" size={20} color="white" />
        </Pressable>
        {(item.status !== 'delivered') && (
          <Pressable
            style={styles.advanceButton}
            onPress={() => handleNextStatus(item)}
          >
            <MaterialCommunityIcons name="arrow-right-bold-circle" size={20} color="white" />
          </Pressable>
        )}
      </View>
    )
  }

  const renderEmptyOrdersList = () => {
    return (
      <TextRegular textStyle={styles.emptyList}>
        This restaurant has no orders yet.
      </TextRegular>
    )
  }

  const fetchRestaurantDetail = async () => {
    try {
      const fetchedRestaurant = await getDetail(route.params.id)
      setRestaurant(fetchedRestaurant)
    } catch (error) {
      showMessage({
        message: `There was an error while retrieving restaurant details (id ${route.params.id}). ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyOrdersList}
        style={styles.container}
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginBottom: 5,
    backgroundColor: GlobalStyles.brandSecondary
  },
  restaurantHeaderContainer: {
    height: 250,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    margin: 10
  },
  description: {
    color: 'white'
  },
  textTitle: {
    fontSize: 20,
    color: 'white'
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  },
  button: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    width: '80%'
  },
  text: {
    fontSize: 12,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  availability: {
    textAlign: 'right',
    marginRight: 5,
    color: GlobalStyles.brandSecondary
  },
  actionButton: {
    borderRadius: 8,
    height: 40,
    marginTop: 12,
    margin: '1%',
    padding: 10,
    alignSelf: 'center',
    flexDirection: 'column',
    width: '50%'
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    bottom: 5,
    position: 'absolute',
    width: '90%'
  },
  analyticsContainer: {
    flexDirection: 'column',
    backgroundColor: GlobalStyles.brandPrimary,
    paddingVertical: 10
  },
  analyticsRow: {
    flexDirection: 'row'
  },
  analyticsCell: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    color: 'white',
    fontSize: 12,
    alignItems: 'center'
  },
  editButton: {
    padding: 8,
    alignSelf: 'flex-start'
  }
})
