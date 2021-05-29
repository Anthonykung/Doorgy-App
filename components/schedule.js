<ScrollView style={{
        width: '100%',
        height: '80%'
      }}>
        {config.schedule && config.schedule.map((value, index, arr) => (
          <TouchableOpacity
            onPress={() => {
              if (index > -1) {
                arr.splice(index, 1);
              }
              doorgyUpdate();
            }}
            style={[
              styles.secondaryButton
            ]}
            key={index}
          >
            <Text
              style={[
                styles.secondaryLabel
              ]}
            >
              Day: {value.day}{'\n'}
              Start Time: {value.hour + ':' + value.minutes}{'\n'}
              End Time: {value.endHour + ':' + value.endMinutes}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
