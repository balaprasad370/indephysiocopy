import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import color from '../../Constants/color';

import scale from '../../utils/utils';
import TableComponent from './TableComponent';
import PlansComponents from './PlansComponent';
import {useNavigation} from '@react-navigation/native';
import {ROUTES} from '../../Constants/routes';
const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqData = [
    {
      question:
        "How much time it'll take for me to complete the German Language Training?",
      answer:
        'Based on how much time you can dedicate to learning German each day, your timeline for proficiency will vary. If you can commit 4 to 6 hours daily, you could reach your goal in 6 to 8 months. However, if you re employed full-time, you would likely need at least a year, assuming you can devote at least 1 hour per day.\nThe key is to start early if you re in your second year of undergraduate studies, begin by learning German for 20 to 30 minutes daily. This way, within 6 months after graduation, you ll be prepared to start working in Germany. Keep in mind that the application process can only begin once you have your degree certificate and course transcript, not just after course completion.',
    },
    {
      question:
        "How fast I can learn German and migrate for work in Germany? What's the fastest way?",
      answer:
        'Ideally, after you obtain your B2 German language certificate, it takes approximately 4 months to relocate to Germany, assuming you have all the necessary documents prepared from the start.\nA new accelerated skilled workers immigration process was launched in March 2024, but since it is a recent regulation, it may take some time for German employers to fully adopt it. We are working on introducing this process to employers, which could significantly speed up recruitment. With this process, you could potentially secure a visa and start working even with A2 or B1 German language certificates, completing the recognition process while working under the supervision of your employer.',
    },
    {
      question:
        'Can I do the documentation process along with Language training?',
      answer:
        'Yes, we will begin your documentation process during your German language training itself.',
    },
    {
      question: 'How often the classes will be held?',
      answer:
        'We offer an integrated program where our mobile application is intuitively designed to train you based on your performance. If you spend more time using the app and complete more exercises, you ll be able to book additional live classes. The more live classes you attend, the more chapters you can cover.',
    },
    {
      question: "Who are these German trainers? What's their qualification?",
      answer:
        'All our German teachers are qualified trainers from the Goethe Institute. In fact, some of them have previously worked at Goethe and have now retired, choosing to work part-time with us.',
    },
    {
      question: 'What if I am not able to clear the interviews?',
      answer:
        'We will provide you with sufficient training to prepare for interviews and arrange multiple interview opportunities until you secure a position.',
    },
    {
      question:
        "What's the starting salary that I can expect as a Physiotherapist in Germany?",
      answer:
        'The average salary is around 3000 Euros, but it can vary depending on the location, such as the specific Bundesland or whether it s an urban or rural area. As a fresher, you might receive an offer of around 2800 Euros, but with significant experience, salaries can be higher. For example, I ve seen someone with 20 years of experience secure a position through an online interview from India with a salary of 3600 Euros. A small tip: even as a fresher, never accept a salary below 2800 Euros.',
    },
    {
      question: 'Is it safe for Indian females in Germany to live and work?',
      answer:
        'Germany is one of the safest countries, and this is truly the case. It is particularly safe for Indian communities, which are well-regarded here. In fact, Germany is often considered safer than India for women. Respect and privacy are highly valued, and people are not judged based on their attire. Overall, it is a much safer environment.',
    },
    {
      question:
        'Is the starting salary enough for decent accommodation and daily living costs?',
      answer:
        'Yes, the physiotherapy industry in Germany offers an average earning capacity, similar to that of other German physiotherapists. While most Indian communities in Europe are IT professionals with above-average salaries, comparing yourself to other physiotherapists in Germany is more relevant. Compared to Indian physiotherapists in India, the earnings in Germany are significantly better—approximately ten times higher. Additionally, you benefit from a high quality of life, a state-sponsored medical system, and education systems. You also contribute to the pension scheme through your salary, and after working in Germany for five years, you will receive a lifetime pension upon retirement.',
    },
    {
      question:
        'How much budget should I keep aside personally for my this career ambition to learn German and start work in Germany?',
      answer:
        'We offer different packages depending on the time you have for preparation. If you re in a hurry, our premium package costs approximately 3 lakh rupees and allows you to complete the process in 6 months. On the other hand, if you re a student with more time to learn German while continuing your studies, you can spend as little as 30,000 rupees for the language course. The additional costs for certificate attestation, translation, and application may not exceed 1 lakh rupees.\nIn summary, the fastest option costs 3 lakhs, while a second-year student might spend just 1.5 lakhs in total, which is as low as Rs. 500 per month—cheaper than a Netflix subscription!',
    },
    {
      question: 'What are different plans and packages you offer?',
      answer:
        'We offer various plans ranging from basic to advanced, tailored to different learning needs.',
      plans: true,
    },
    {
      question: 'Are there any Installment payments for the consultancy fee ?',
      answer:
        'Yes for the larger packages, we provide the options for installment fee, but ofcourse paying the consultancy fee at once will be cheaper than paying in installments.',
      Installment: true,
    },
    {
      question: 'Is there any discount for bulk enrollments or referrals?',
      answer:
        'Yes, we offer a 5% referral fee for successful referrals, and candidates who join through a referral receive 5% cashback on their monthly subscription fee. This offer applies only to the subscription fee, not the consultancy fee.\nFor example, if you join the Professional pathway by paying a consultancy fee of 34,999 rupees and a monthly subscription fee of 3,499 rupees, you and your referral will each receive a 5% discount on the monthly fee, reducing it to 3,324 rupees. Referring a second friend will further reduce the fee to 3,158 rupees, and referring a third friend will lower it to 3,000 rupees.\nOnce you refer 5 friends, you will be upgraded to an affiliate partner status, receiving a 5% discount on the consultancy fee as well.\nAdditionally, if an institute enrolls a group of 10 students, they will receive a flat 10% discount on both the consultancy fee and the monthly subscription fee.',
    },
    {
      question: 'Do you have any offline centre as well?',
      answer:
        'No, as of now, we are not providing any offline classes, as our program is designed on Self-paced AI assisted mobile learning, each and every candidate will have a personalized pace and class cadence, so it s not practical to host a offline course, as this kind of classroom learning is slow as it has to accommodate all the candidates in common pace.',
    },
    {
      question:
        'Is the German Language difficult to learn? How much effort I need to put in?',
      answer:
        'Learning a new language, including your mother tongue, can indeed be challenging. However, we make it easier by providing extensive practice exercises, flashcards for vocabulary memorization, and real-life listening activities. Our approach is more effective than traditional offline classes because we have optimized the learning process for German language acquisition.\nThe speed of your progress is directly related to the amount of effort you invest. If you can dedicate 3 to 4 hours a day, you can become fluent within 6 months. If you can only spare 1 to 2 hours a day, it will take at least 1 year to achieve fluency.',
    },
  ];

  const navigation = useNavigation();

  const renderItem = ({item, index}) => {
    const paragraphs = item.answer
      .split('\n')
      .filter(paragraph => paragraph.trim() !== '');

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => toggleExpand(index)}
          style={styles.questionContainer}>
          <Text style={styles.questionText}>{item.question}</Text>
          <AntDesign
            name={expandedIndex === index ? 'minus' : 'plus'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
        {expandedIndex === index && (
          <View style={styles.answerContainer}>
            {paragraphs.map((paragraph, idx) => (
              <Text key={idx} style={styles.answerText}>
                {paragraph}
              </Text>
            ))}

            {item.Installment && (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.Installement)}>
                <Text style={{color: color.darkPrimary, fontSize: 18}}>
                  Check our installments
                </Text>
              </TouchableOpacity>
            )}

            {item.plans && (
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.PRICING)}>
                <Text style={{color: color.darkPrimary, fontSize: 18}}>
                  Check Our Packages
                </Text>
              </TouchableOpacity>
            )}
            {/* Installement */}
            {/* {item.plans && <PlansComponents />} */}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={faqData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(10),
    backgroundColor: color.white,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(15),
    marginBottom: scale(10),
    shadowColor: '#f1f4f8',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    borderWidth: 1,
    borderColor: '#EEE',
    shadowRadius: 2,
    elevation: 2,
  },
  questionContainer: {
    flexDirection: 'row',
    backgroundColor: color.lightPrimary,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: scale(15),
    borderRadius: scale(15),
    borderColor: color.lightPrimary,
    borderWidth: 1,
  },
  questionText: {
    fontSize: 16,
    width: '90%',
    color: color.black, // Blue color for questions
  },
  answerContainer: {
    padding: scale(10),
  },
  answerText: {
    fontSize: 14,
    marginBottom: scale(6),
    color: color.black, // Lighter blue for answers
  },
});

export default FAQ;
