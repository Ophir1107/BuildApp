#from tensorflow.keras.applications.resnet50 import preprocess_input
#from tensorflow.keras.preprocessing.image import ImageDataGenerator
#from tensorflow.keras.preprocessing import image

import numpy as np
import matplotlib.pyplot as plt
from keras.preprocessing import image
from keras.preprocessing.image import ImageDataGenerator
from keras.applications.resnet import preprocess_input
from keras.models import load_model
from keras.utils import load_img, img_to_array
import sys

print('hi')
train_datagen = image.ImageDataGenerator(preprocessing_function=preprocess_input,
                                  shear_range=0.2,
                                  zoom_range=0.2,
                                  horizontal_flip=True,
                                  validation_split=0.4)

model = load_model(r"ResNet50_classification_cur.h5") 
print('load model')
def set_label(y):
    max_index = y.argmax()
    if max_index==0:
        output = 'Air conditioning'
    elif max_index==1:
        output = 'Construction'
    elif max_index==2:
        output = 'Electricity'
    elif max_index==3:
        output = 'Plumbing'
    return output
print('set label with /', sys.argv[1])
path = sys.argv[1][1:]
img = load_img(path, target_size=(224,224))
print('load img')
img = img_to_array(img)
print('img to array')
img = np.expand_dims(img, 0)
print('np expand')
input_img = train_datagen.flow(img, batch_size=1)
print('flowwwww')
y_hat = model.predict(input_img)
print('predict')
label = set_label(y_hat)
print('set label')

# print('The prediction: ', label, '\n')
print(label)
 
# img_height, img_width = (224, 224)
# test_data_check = r"images_check"
# test_generator = train_datagen.flow_from_directory(
#     test_data_check,
#     target_size=(img_height, img_width),
#     batch_size=1,
#     class_mode='categorical',
#     subset='validation')

# x,y = test_generator.next()
# y_hat = model.predict(x)
# print('The prediction:', y_hat, '\n')
# print('the real value: ', y)