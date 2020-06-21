import React, {Fragment} from 'react';
import {Avatar, Title, Caption, Drawer} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AuthContext} from '../components/AuthContext';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native';

const imageURL =
  'https://www.gravatar.com/avatar/7f6232daa4db3439bb8e7c2f06650962';

const Profile = () => {
  const {signOut} = React.useContext(AuthContext);
  return (
    <View style={{flex: 1}}>
      <ScrollView>
        <View style={styles.userInfoSection}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Avatar.Image
              source={{
                uri: imageURL,
              }}
              size={50}
            />
            <View style={{flexDirection: 'column', marginLeft: 15}}>
              <Title style={styles.title}>Rishivikram N</Title>
              <Caption style={styles.caption}>rishi.vikram.1</Caption>
            </View>
          </View>
        </View>
        <View style={{marginLeft: 20, paddingTop: 20}}>
          <TouchableOpacity style={styles.section} onPress={() => signOut()}>
            <MaterialCommunityIcons
              name="exit-to-app"
              color="#000000"
              size={28}
            />
            <Text>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default Profile;
