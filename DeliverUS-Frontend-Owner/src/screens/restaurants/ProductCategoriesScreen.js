/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from 'react'
import { StyleSheet, FlatList, Pressable, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import TextRegular from '../../components/TextRegular'
import TextSemiBold from '../../components/TextSemibold'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import DeleteModal from '../../components/DeleteModal'
import { getCategoriesByRestaurant, removeCategory } from '../../api/CategoriesEndpoints'


export default function ProductCategoriesScreen ({navigation, route}) {
  const [categories, setCategories] = useState([])
  const [categoryToBeDeleted, setCategoryToBeDeleted] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [route])

  const fetchCategories = async() => {
    try{
      const fetched = await getCategoriesByRestaurant(route.params.id)
      setCategories(fetched)
    } catch(error) {
      showMessage({
        message: `There was an error while retrieving categories. ${error}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  const removeProductCategory = async(category) => {
    try{
      await removeCategory(category.id)
      setCategoryToBeDeleted(null)
      showMessage({
        message: `The category was deleted successfuly`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      fetchCategories()
    } catch(e) {
      showMessage({
        message: `There was an error while deleting a category. ${e}`,
        type: 'error',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
    }
  }

  //Cabecera con el botón para crear una nueva categoría. Se muestra siempre, aunque no haya categorías creadas
  const renderHeader = () => (
    <Pressable
      onPress = {() => navigation.navigate('CreateProductCategoryScreen', {id: route.params.id})}
      style={({pressed}) => [
        {
          backgroundColor: pressed
            ? GlobalStyles.brandGreenTap
            : GlobalStyles.brandGreen
        },
        styles.button
      ]}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
        <MaterialCommunityIcons name='plus-circle' color={'white'} size={20} />
        <TextRegular textStyle={styles.text}>Create product category</TextRegular>
      </View>
    </Pressable>
  )

  //Cada fila del listado: nombre + botón de editar y eliminar
  const renderCategory = ({item}) => (
    <View style = {styles.categoryRow}>
      <TextSemiBold textStyle={styles.categoryName}>{item.name}</TextSemiBold>

      <View style = {styles.actionButtonsContainer}>
        <Pressable
          onPress={() => navigation.navigate('EditProductScreenCategory', {id:item.id, restaurantId: route.params.id})}
          style = {({pressed}) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandBlueTap
                : GlobalStyles.brandBlue
            },
            styles.actionButton
          ]}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <MaterialCommunityIcons name='pencil' color={'white'} size={20} />
            <TextRegular textStyle={styles.text}>Edit</TextRegular>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setCategoryToBeDeleted(item)}
          style = {({pressed}) => [
            {
              backgroundColor: pressed
                ? GlobalStyles.brandPrimaryTap
                : GlobalStyles.brandPrimary
            },
            styles.actionButton
          ]}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
            <MaterialCommunityIcons name='trash-can' color={'white'} size={20} />
            <TextRegular textStyle={styles.text}>Delete</TextRegular>
          </View>
          </Pressable>
      </View>
    </View>
  )

  const renderEmptyList = () => (
    <TextRegular textStyle={styles.emptyList}>
      There are no categories yet. 
    </TextRegular>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategory}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
      />

      {/* Modal de confirmación de borrado (RF.03) */}
      <DeleteModal
        isVisible={categoryToBeDeleted !== null}
        onCancel={() => setCategoryToBeDeleted(null)}
        onConfirm={() => removeProductCategory(categoryToBeDeleted)}>
        <TextRegular>
          If the category has products associated, it cannot be deleted.
        </TextRegular>
      </DeleteModal>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignContent: 'center', padding: 10
  },
  categoryName: {
    textAlign: 'center',
    flex: 1,
  },
  categoryRow: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 5,
    paddingHorizontal: 10,

    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    flex: 1
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
  actionButton: {
    borderRadius: 8,
    height: 40,
    flex: 1,
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
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginLeft: 5
  },
  emptyList: {
    textAlign: 'center',
    padding: 50
  }
})