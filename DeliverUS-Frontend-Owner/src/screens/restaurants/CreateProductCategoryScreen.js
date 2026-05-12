import React, { useState } from 'react'
import { StyleSheet, Pressable, View, ScrollView } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Formik, ErrorMessage } from 'formik'
import * as yup from 'yup'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import TextError from '../../components/TextError'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { showMessage } from 'react-native-flash-message'
import { createCategory } from '../../api/CategoriesEndpoints'

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .max(255, 'Name too long')
    .required('Name is required')
})

export default function CreateProductCategoryScreen ({ navigation, route }) {
  const [backendErrors, setBackendErrors] = useState([])

  // El restaurantId viaja como parámetro de navegación
  const initialValues = { name: '', restaurantId: route.params.id }

  const handleSubmit = async (values) => {
    setBackendErrors([])
    try {
      await createCategory(values)
      showMessage({
        message: 'Category successfully created',
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      // Volvemos al listado de categorías para ver la recién creada
      navigation.navigate('ProductCategoriesScreen', { id: route.params.id })
    } catch (error) {
      setBackendErrors(error.errors ?? [])
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}>
      {({ handleSubmit }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem name='name' label='Category name:' />
              <ErrorMessage name='name' render={msg => <TextError>{msg}</TextError>} />

              {backendErrors.map((error, index) => (
                <TextError key={index}>{error.param} - {error.msg}</TextError>
              ))}

              <Pressable
                onPress={handleSubmit}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20} />
                  <TextRegular textStyle={styles.text}>Save</TextRegular>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  }
})