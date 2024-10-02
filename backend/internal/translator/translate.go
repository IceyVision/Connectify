package translator

import (
    "fmt"

    "github.com/aws/aws-sdk-go/aws"
    "github.com/aws/aws-sdk-go/aws/session"
    "github.com/aws/aws-sdk-go/service/translate"
	"log"

)

var translateSession *translate.Translate

func init() {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String("ap-southeast-2"),
	})

	if err != nil {
		log.Fatalf("Failed to create session: %v", err)
	}

	translateSession = translate.New(sess)
}


func TranslateText(text string, sourceLang string, targetLang string) (string, error) {
    // Add translation logic here (e.g., call AWS Translate)
	input := &translate.TextInput{

		SourceLanguageCode: aws.String(sourceLang),
		TargetLanguageCode: aws.String(targetLang),
		Text: aws.String(string(text)),
	}
	

	result, err := translateSession.Text(input)
	if err != nil {
		return "", fmt.Errorf("translation failed: %v", err)
	}

	return *result.TranslatedText, nil
}
