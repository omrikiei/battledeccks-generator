import {data as pictures} from '../data/pictures.json'
import {data as sentences} from '../data/sentences.json'
import {data as phrases} from '../data/phrases.json'
import {data as adjectives} from '../data/adjectives.json'
import {data as breakfastIdeas} from '../data/breakfast-idea.json'
import {data as questions} from '../data/questions.json'

function randomIndex(n: any[]): number {
    return Math.floor(Math.random() * n.length)
}

export class RandomWordGeneratorClient {
    selectionMap = [this.randomQuestion, this.randomPhrase, this.randomSentence, this.randomAdjective,
        this.randomQuestion, this.randomPhrase, this.randomSentence, this.randomAdjective, this.randomBreakfastIdea]

    randomImageSrc(): string {
        return 'https://randomwordgenerator.com/img/picture-generator/' + pictures[Math.floor(Math.random() * pictures.length)].image_url
    }

    randomPhrase(): string {
        return phrases[randomIndex(phrases)].phrase
    }

    randomSentence(): string {
        return sentences[randomIndex(sentences)].sentence
    }

    randomAdjective(): string {
        return adjectives[randomIndex(adjectives)].adjective.value
    }

    randomBreakfastIdea(): string {
        return breakfastIdeas[randomIndex(breakfastIdeas)].title
    }

    randomQuestion(): string {
        return questions[randomIndex(questions)].question
    }

    randomSlideTitle(): string {
        return this.selectionMap[randomIndex(this.selectionMap)]()
    }

}
